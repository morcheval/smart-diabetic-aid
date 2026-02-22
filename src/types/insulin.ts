/**
 * types/insulin.ts — Types et constantes pour le suivi de l'insuline
 * 
 * Définit les interfaces pour :
 * - Les types d'insuline (rapide, lente, mixte)
 * - Les contextes d'injection (avant/après repas, matin, coucher)
 * - Les logs d'injection enregistrés en base de données
 * - Les presets (raccourcis) configurés par l'utilisateur
 */

/** Type d'insuline : rapide (bolus), lente (basale), ou mixte */
export type InsulinType = 'rapide' | 'lente' | 'mixte';

/** Contexte du moment de l'injection */
export type MealContext = 'avant_repas' | 'apres_repas' | 'couche' | 'matin' | 'aucun';

/** Un enregistrement d'injection d'insuline (stocké en base de données) */
export interface InsulinLog {
  id: string;
  created_at: string;
  date: string;              // Date de l'injection (YYYY-MM-DD)
  time: string;              // Heure de l'injection (HH:mm)
  insulin_type: InsulinType; // Type d'insuline utilisée
  insulin_name: string | null; // Nom commercial (ex: Novorapid, Lantus)
  dose_units: number;        // Dose en unités internationales (UI)
  meal_context: MealContext; // Quand a lieu l'injection par rapport au repas
  blood_glucose: number | null; // Glycémie mesurée en mg/dL (optionnel)
  notes: string | null;      // Notes libres de l'utilisateur
}

/** Données nécessaires pour créer un nouveau log d'injection */
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

/** Labels français pour les types d'insuline */
export const INSULIN_TYPE_LABELS: Record<InsulinType, string> = {
  rapide: 'Rapide',
  lente: 'Lente',
  mixte: 'Mixte',
};

/** Labels français pour les contextes de repas */
export const MEAL_CONTEXT_LABELS: Record<MealContext, string> = {
  avant_repas: 'Avant repas',
  apres_repas: 'Après repas',
  couche: 'Coucher',
  matin: 'Matin',
  aucun: 'Aucun',
};

/** Couleurs CSS pour distinguer visuellement les types d'insuline (badges) */
export const INSULIN_TYPE_COLORS: Record<InsulinType, string> = {
  rapide: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
  lente: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
  mixte: 'bg-orange-500/15 text-orange-600 border-orange-500/30',
};

/** Couleurs des points/pastilles pour les types d'insuline */
export const INSULIN_TYPE_DOT_COLORS: Record<InsulinType, string> = {
  rapide: 'bg-blue-500',
  lente: 'bg-purple-500',
  mixte: 'bg-orange-500',
};

/** Un raccourci d'insuline pré-configuré par l'utilisateur dans son profil */
export interface InsulinPreset {
  id: string;
  name: string;                  // Nom de l'insuline (ex: "Novorapid")
  insulin_type: InsulinType;     // Type
  default_dose: number;          // Dose habituelle en UI
  meal_context: MealContext;     // Contexte habituel
}

/**
 * Détermine la zone de glycémie et retourne label + couleurs.
 * Zones selon les standards médicaux :
 * - <70 mg/dL : Basse (hypoglycémie — danger)
 * - 70-140 mg/dL : Normale (cible)
 * - 141-180 mg/dL : Élevée (à surveiller)
 * - >180 mg/dL : Critique (hyperglycémie)
 */
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
