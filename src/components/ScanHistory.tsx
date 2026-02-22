/**
 * components/ScanHistory.tsx — Historique des scans alimentaires
 * 
 * Affiche les 20 derniers scans (code-barres ou photo) stockés en base de données.
 * Chaque scan montre : nom, photo (si disponible), calories, glucides, IG, date.
 * L'utilisateur peut supprimer un scan de l'historique.
 * 
 * Ce composant est affiché en bas de la page Scanner.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Wheat, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getGlycemicImpactLabel } from '@/types/nutrition';

/** Structure d'un scan alimentaire stocké en base de données */
interface FoodScan {
  id: string;
  food_name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  glycemic_index: number | null;
  photo_url: string | null;
  ai_description: string | null;
  scan_type: string;       // 'barcode' ou 'photo'
  created_at: string;
}

export default function ScanHistory() {
  const [scans, setScans] = useState<FoodScan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /** Charge les 20 derniers scans depuis la base de données */
  const fetchScans = async () => {
    const { data } = await supabase
      .from('food_scans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    setScans((data as FoodScan[]) || []);
    setLoading(false);
  };

  // Chargement initial au montage du composant
  useEffect(() => { fetchScans(); }, []);

  /** Supprime un scan de la base de données et met à jour la liste locale */
  const handleDelete = async (id: string) => {
    await supabase.from('food_scans').delete().eq('id', id);
    setScans((prev) => prev.filter((s) => s.id !== id));
    toast({ title: 'Scan supprimé' });
  };

  if (loading) return <p className="text-sm text-muted-foreground text-center py-4">Chargement...</p>;
  if (scans.length === 0) return null; // Ne rien afficher s'il n'y a pas d'historique

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Historique des scans
      </h2>
      {scans.map((scan) => {
        const gi = scan.glycemic_index ? getGlycemicImpactLabel(scan.glycemic_index) : null;
        return (
          <Card key={scan.id} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-3">
              {/* Photo du scan ou icône par défaut */}
              {scan.photo_url ? (
                <img
                  src={scan.photo_url}
                  alt={scan.food_name}
                  className="h-12 w-12 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-lg">{scan.scan_type === 'barcode' ? '📷' : '🍽️'}</span>
                </div>
              )}
              {/* Infos nutritionnelles */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{scan.food_name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Flame className="h-3 w-3" />{Math.round(scan.calories)} kcal
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Wheat className="h-3 w-3" />{scan.carbs}g
                  </span>
                  {gi && <span className={`text-[10px] font-medium ${gi.color}`}>IG {scan.glycemic_index}</span>}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(scan.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {/* Bouton supprimer */}
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => handleDelete(scan.id)}>
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
