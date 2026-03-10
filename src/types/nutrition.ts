/**
 * types/nutrition.ts — Types et constantes pour la gestion nutritionnelle
 * 
 * Définit les interfaces TypeScript pour :
 * - Le profil utilisateur (objectifs, type de diabète)
 * - Les aliments de la base de données
 * - Les entrées de repas dans le journal
 * - Les totaux nutritionnels quotidiens
 */

/** Types de diabète supportés par l'application */
export type DiabetesType = 'type1' | 'type2' | 'gestational';

/** Profil de l'utilisateur avec ses objectifs nutritionnels quotidiens */
export interface UserProfile {
  name: string;                    // Nom de l'utilisateur
  age?: number;                    // Âge
  gender?: 'homme' | 'femme' | 'autre'; // Sexe
  weight?: number;                 // Poids (kg)
  height?: number;                 // Taille (cm)
  diabetesType: DiabetesType;      // Type de diabète
  calorieGoal: number;             // Objectif calories (kcal/jour)
  carbGoal: number;                // Objectif glucides (g/jour)
  proteinGoal: number;             // Objectif protéines (g/jour)
  fatGoal: number;                 // Objectif lipides (g/jour)
  sugarGoal: number;               // Objectif sucre (g/jour)
  saltGoal: number;                // Objectif sel (g/jour)
  carbInsulinRatio?: number;       // Ratio glucides/insuline
  insulinPresets?: import('@/types/insulin').InsulinPreset[]; // Insulines favorites pré-configurées
}

/** Un aliment de la base de données locale (valeurs pour 100g) */
export interface FoodItem {
  id: string;
  name: string;
  category: string;       // Ex: "Fruits", "Légumes", "Céréales"
  calories: number;       // kcal pour 100g
  carbs: number;          // Glucides en g pour 100g
  protein: number;        // Protéines en g pour 100g
  fat: number;            // Lipides en g pour 100g
  fiber: number;          // Fibres en g pour 100g
  sugar: number;          // Sucre en g pour 100g
  salt: number;           // Sel en g pour 100g
  glycemicIndex: number;  // Index glycémique (0-100) — important pour les diabétiques
  servingSize: number;    // Taille de portion suggérée en grammes
  icon: string;           // Emoji représentant l'aliment
}

/** Une entrée de repas dans le journal alimentaire */
export interface MealEntry {
  id: string;
  foodId: string;          // Référence vers l'aliment (ou ID généré pour les scans)
  foodName: string;        // Nom affiché de l'aliment
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'; // Type de repas
  quantity: number;        // Quantité consommée en grammes
  calories: number;        // Calories calculées selon la quantité
  carbs: number;           // Glucides calculés
  protein: number;         // Protéines calculées
  fat: number;             // Lipides calculés
  fiber: number;           // Fibres calculées
  sugar: number;           // Sucre calculé
  salt: number;            // Sel calculé
  glycemicIndex: number;   // IG de l'aliment
  date: string;            // Date au format YYYY-MM-DD
  time: string;            // Heure au format HH:mm
}

/** Totaux nutritionnels pour une journée */
export interface DailyNutrition {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
  salt: number;
}

/** Labels français pour les types de repas */
export const MEAL_TYPE_LABELS: Record<MealEntry['mealType'], string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
  snack: 'Collation',
};

/** Emojis pour les types de repas */
export const MEAL_TYPE_ICONS: Record<MealEntry['mealType'], string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

/** Labels français pour les types de diabète */
export const DIABETES_TYPE_LABELS: Record<DiabetesType, string> = {
  type1: 'Type 1',
  type2: 'Type 2',
  gestational: 'Gestationnel',
};

/**
 * Retourne le label et la couleur CSS correspondant à un index glycémique.
 * - ≤55 : Faible (vert) — recommandé pour les diabétiques
 * - 56-69 : Moyen (jaune) — à consommer avec modération
 * - ≥70 : Élevé (rouge) — provoque des pics glycémiques
 */
export function getGlycemicImpactLabel(gi: number): { label: string; color: string } {
  if (gi <= 55) return { label: 'Faible', color: 'text-green-500' };
  if (gi <= 69) return { label: 'Moyen', color: 'text-yellow-500' };
  return { label: 'Élevé', color: 'text-red-500' };
}
