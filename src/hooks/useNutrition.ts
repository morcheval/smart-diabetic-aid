import { useMemo } from 'react';
import { format } from 'date-fns';
import { useLocalStorage } from './useLocalStorage';
import { MealEntry, UserProfile, DailyNutrition, DiabetesType } from '@/types/nutrition';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Utilisateur',
  diabetesType: 'type1',
  calorieGoal: 2000,
  carbGoal: 250,
  proteinGoal: 75,
  fatGoal: 65,
  insulinPresets: [],
};

export function useNutrition() {
  const [profile, setProfile] = useLocalStorage<UserProfile>('nutri-profile', DEFAULT_PROFILE);
  const [meals, setMeals] = useLocalStorage<MealEntry[]>('nutri-meals', []);

  const addMeal = (entry: Omit<MealEntry, 'id'>) => {
    const newEntry: MealEntry = { ...entry, id: crypto.randomUUID() };
    setMeals((prev) => [...prev, newEntry]);
  };

  const removeMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const getMealsForDate = (date: string): MealEntry[] => {
    return meals.filter((m) => m.date === date);
  };

  const getDailyNutrition = (date: string): DailyNutrition => {
    const dayMeals = getMealsForDate(date);
    return dayMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        carbs: acc.carbs + m.carbs,
        protein: acc.protein + m.protein,
        fat: acc.fat + m.fat,
        fiber: acc.fiber + m.fiber,
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 }
    );
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayNutrition = useMemo(() => getDailyNutrition(today), [meals, today]);
  const todayMeals = useMemo(() => getMealsForDate(today), [meals, today]);

  return {
    profile,
    setProfile,
    meals,
    addMeal,
    removeMeal,
    getMealsForDate,
    getDailyNutrition,
    todayNutrition,
    todayMeals,
    today,
  };
}
