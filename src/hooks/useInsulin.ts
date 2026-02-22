/**
 * hooks/useInsulin.ts — Hooks pour le suivi des injections d'insuline
 * 
 * Utilise React Query + la base de données pour :
 * - Lire les injections d'un jour donné (useInsulinLogs)
 * - Calculer les stats hebdomadaires (useWeeklyInsulinStats)
 * - Ajouter une injection (useAddInsulinLog)
 * - Supprimer une injection (useRemoveInsulinLog)
 * 
 * Contrairement au journal alimentaire (localStorage), les injections
 * sont stockées en base de données pour plus de fiabilité.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InsulinLog, InsulinLogInsert } from '@/types/insulin';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';

// Clé de cache pour React Query — permet d'invalider le cache après une mutation
const QUERY_KEY = 'insulin_logs';

/**
 * Récupère toutes les injections d'insuline pour une date donnée.
 * Les résultats sont triés par heure croissante.
 */
export function useInsulinLogs(date: string) {
  return useQuery({
    queryKey: [QUERY_KEY, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insulin_logs')
        .select('*')
        .eq('date', date)
        .order('time', { ascending: true });
      if (error) throw error;
      return (data ?? []) as InsulinLog[];
    },
  });
}

/**
 * Calcule les statistiques d'insuline et glycémie sur les 7 derniers jours.
 * Retourne :
 * - avgGlycemia : glycémie moyenne
 * - dosesByType : total des doses par type (rapide, lente, mixte)
 * - countsByType : nombre d'injections par type
 * - dailyData : données jour par jour pour le graphique
 */
export function useWeeklyInsulinStats() {
  return useQuery({
    queryKey: [QUERY_KEY, 'weekly'],
    queryFn: async () => {
      const today = new Date();
      const sevenDaysAgo = format(subDays(today, 6), 'yyyy-MM-dd');
      const todayStr = format(today, 'yyyy-MM-dd');

      // Récupère tous les logs des 7 derniers jours
      const { data, error } = await supabase
        .from('insulin_logs')
        .select('*')
        .gte('date', sevenDaysAgo)
        .lte('date', todayStr)
        .order('date', { ascending: true });

      if (error) throw error;
      const logs = (data ?? []) as InsulinLog[];

      // Calcul de la glycémie moyenne (exclut les entrées sans glycémie)
      const withGlycemia = logs.filter((l) => l.blood_glucose != null);
      const avgGlycemia =
        withGlycemia.length > 0
          ? withGlycemia.reduce((sum, l) => sum + (l.blood_glucose ?? 0), 0) / withGlycemia.length
          : null;

      // Total des doses par type d'insuline
      const dosesByType = {
        rapide: logs.filter((l) => l.insulin_type === 'rapide').reduce((s, l) => s + l.dose_units, 0),
        lente: logs.filter((l) => l.insulin_type === 'lente').reduce((s, l) => s + l.dose_units, 0),
        mixte: logs.filter((l) => l.insulin_type === 'mixte').reduce((s, l) => s + l.dose_units, 0),
      };

      // Nombre d'injections par type
      const countsByType = {
        rapide: logs.filter((l) => l.insulin_type === 'rapide').length,
        lente: logs.filter((l) => l.insulin_type === 'lente').length,
        mixte: logs.filter((l) => l.insulin_type === 'mixte').length,
      };

      // Construction des données jour par jour pour le graphique à barres
      const dailyData: { date: string; label: string; glycemia: number | null; doses: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = subDays(today, i);
        const dateStr = format(d, 'yyyy-MM-dd');
        const dayLogs = logs.filter((l) => l.date === dateStr);
        const dayGlycemia = dayLogs.filter((l) => l.blood_glucose != null);
        const avgDay =
          dayGlycemia.length > 0
            ? dayGlycemia.reduce((s, l) => s + (l.blood_glucose ?? 0), 0) / dayGlycemia.length
            : null;
        dailyData.push({
          date: dateStr,
          label: format(d, 'dd/MM'),
          glycemia: avgDay ? Math.round(avgDay) : null,
          doses: dayLogs.reduce((s, l) => s + l.dose_units, 0),
        });
      }

      return {
        avgGlycemia: avgGlycemia ? Math.round(avgGlycemia) : null,
        dosesByType,
        countsByType,
        dailyData,
        totalLogs: logs.length,
      };
    },
  });
}

/**
 * Mutation pour ajouter une nouvelle injection d'insuline en base de données.
 * Après succès, invalide le cache pour rafraîchir les listes.
 */
export function useAddInsulinLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (entry: InsulinLogInsert) => {
      const { data, error } = await supabase.from('insulin_logs').insert(entry).select().single();
      if (error) throw error;
      return data as InsulinLog;
    },
    onSuccess: () => {
      // Invalide le cache pour que les listes se mettent à jour automatiquement
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: '✅ Injection enregistrée', description: 'Le suivi a bien été sauvegardé.' });
    },
    onError: () => {
      toast({ title: 'Erreur', description: "Impossible d'enregistrer l'injection.", variant: 'destructive' });
    },
  });
}

/**
 * Mutation pour supprimer une injection d'insuline de la base de données.
 */
export function useRemoveInsulinLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('insulin_logs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Supprimé', description: "L'entrée a été supprimée." });
    },
  });
}
