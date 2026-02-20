import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InsulinLog, InsulinLogInsert } from '@/types/insulin';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';

const QUERY_KEY = 'insulin_logs';

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

export function useWeeklyInsulinStats() {
  return useQuery({
    queryKey: [QUERY_KEY, 'weekly'],
    queryFn: async () => {
      const today = new Date();
      const sevenDaysAgo = format(subDays(today, 6), 'yyyy-MM-dd');
      const todayStr = format(today, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('insulin_logs')
        .select('*')
        .gte('date', sevenDaysAgo)
        .lte('date', todayStr)
        .order('date', { ascending: true });

      if (error) throw error;
      const logs = (data ?? []) as InsulinLog[];

      // Glycemia average
      const withGlycemia = logs.filter((l) => l.blood_glucose != null);
      const avgGlycemia =
        withGlycemia.length > 0
          ? withGlycemia.reduce((sum, l) => sum + (l.blood_glucose ?? 0), 0) / withGlycemia.length
          : null;

      // Doses by type
      const dosesByType = {
        rapide: logs.filter((l) => l.insulin_type === 'rapide').reduce((s, l) => s + l.dose_units, 0),
        lente: logs.filter((l) => l.insulin_type === 'lente').reduce((s, l) => s + l.dose_units, 0),
        mixte: logs.filter((l) => l.insulin_type === 'mixte').reduce((s, l) => s + l.dose_units, 0),
      };

      const countsByType = {
        rapide: logs.filter((l) => l.insulin_type === 'rapide').length,
        lente: logs.filter((l) => l.insulin_type === 'lente').length,
        mixte: logs.filter((l) => l.insulin_type === 'mixte').length,
      };

      // Build daily glycemia chart data
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: '✅ Injection enregistrée', description: 'Le suivi a bien été sauvegardé.' });
    },
    onError: () => {
      toast({ title: 'Erreur', description: "Impossible d'enregistrer l'injection.", variant: 'destructive' });
    },
  });
}

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
