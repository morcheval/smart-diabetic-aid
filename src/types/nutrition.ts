export type DiabetesType = 'type1' | 'type2' | 'gestational';

export interface UserProfile {
  name: string;
  diabetesType: DiabetesType;
  calorieGoal: number;
  carbGoal: number;
  proteinGoal: number;
  fatGoal: number;
  insulinPresets?: import('@/types/insulin').InsulinPreset[];
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number; // per 100g
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  glycemicIndex: number; // 0-100
  servingSize: number; // grams
  icon: string;
}

export interface MealEntry {
  id: string;
  foodId: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number; // grams
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  glycemicIndex: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface DailyNutrition {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
}

export const MEAL_TYPE_LABELS: Record<MealEntry['mealType'], string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
  snack: 'Collation',
};

export const MEAL_TYPE_ICONS: Record<MealEntry['mealType'], string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export const DIABETES_TYPE_LABELS: Record<DiabetesType, string> = {
  type1: 'Type 1',
  type2: 'Type 2',
  gestational: 'Gestationnel',
};

export function getGlycemicImpactLabel(gi: number): { label: string; color: string } {
  if (gi <= 55) return { label: 'Faible', color: 'text-green-500' };
  if (gi <= 69) return { label: 'Moyen', color: 'text-yellow-500' };
  return { label: 'Élevé', color: 'text-red-500' };
}
