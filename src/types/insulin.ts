export type InsulinType = 'rapide' | 'lente' | 'mixte';
export type MealContext = 'avant_repas' | 'apres_repas' | 'couche' | 'matin' | 'aucun';

export interface InsulinLog {
  id: string;
  created_at: string;
  date: string;
  time: string;
  insulin_type: InsulinType;
  insulin_name: string | null;
  dose_units: number;
  meal_context: MealContext;
  blood_glucose: number | null;
  notes: string | null;
}

export interface InsulinLogInsert {
  date: string;
  time: string;
  insulin_type: InsulinType;
  insulin_name?: string | null;
  dose_units: number;
  meal_context: MealContext;
  blood_glucose?: number | null;
  notes?: string | null;
}

export const INSULIN_TYPE_LABELS: Record<InsulinType, string> = {
  rapide: 'Rapide',
  lente: 'Lente',
  mixte: 'Mixte',
};

export const MEAL_CONTEXT_LABELS: Record<MealContext, string> = {
  avant_repas: 'Avant repas',
  apres_repas: 'Après repas',
  couche: 'Coucher',
  matin: 'Matin',
  aucun: 'Aucun',
};

export const INSULIN_TYPE_COLORS: Record<InsulinType, string> = {
  rapide: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
  lente: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
  mixte: 'bg-orange-500/15 text-orange-600 border-orange-500/30',
};

export const INSULIN_TYPE_DOT_COLORS: Record<InsulinType, string> = {
  rapide: 'bg-blue-500',
  lente: 'bg-purple-500',
  mixte: 'bg-orange-500',
};

export function getGlycemiaZone(value: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (value < 70) {
    return { label: 'Basse', color: 'text-red-600', bgColor: 'bg-red-500/10' };
  } else if (value <= 140) {
    return { label: 'Normale', color: 'text-green-600', bgColor: 'bg-green-500/10' };
  } else if (value <= 180) {
    return { label: 'Élevée', color: 'text-orange-600', bgColor: 'bg-orange-500/10' };
  } else {
    return { label: 'Critique', color: 'text-red-600', bgColor: 'bg-red-500/10' };
  }
}
