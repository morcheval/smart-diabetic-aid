/**
 * hooks/useNutrition.ts — Hook principal pour la gestion nutritionnelle
 * 
 * Ce hook centralise toute la logique nutritionnelle de l'app :
 * - Profil utilisateur (nom, type de diabète, objectifs)
 * - Liste des repas enregistrés
 * - Ajout/suppression de repas
 * - Calcul des totaux nutritionnels par jour
 * 
 * Les données sont stockées dans le localStorage via useLocalStorage.
 */

import { useMemo } from 'react';
import { format } from 'date-fns';
import { useLocalStorage } from './useLocalStorage';
import { MealEntry, UserProfile, DailyNutrition, DiabetesType } from '@/types/nutrition';

/** Profil par défaut pour un nouvel utilisateur */
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
  // Données persistées dans le localStorage
  const [profile, setProfile] = useLocalStorage<UserProfile>('nutri-profile', DEFAULT_PROFILE);
  const [meals, setMeals] = useLocalStorage<MealEntry[]>('nutri-meals', []);

  /** Ajouter un repas au journal (génère un ID unique automatiquement) */
  const addMeal = (entry: Omit<MealEntry, 'id'>) => {
    const newEntry: MealEntry = { ...entry, id: crypto.randomUUID() };
    setMeals((prev) => [...prev, newEntry]);
  };

  /** Supprimer un repas du journal par son ID */
  const removeMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  /** Récupérer tous les repas pour une date donnée (format YYYY-MM-DD) */
  const getMealsForDate = (date: string): MealEntry[] => {
    return meals.filter((m) => m.date === date);
  };

  /** Calculer les totaux nutritionnels pour une date donnée */
  const getDailyNutrition = (date: string): DailyNutrition => {
    const dayMeals = getMealsForDate(date);
    // Additionne toutes les valeurs nutritionnelles des repas du jour
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

  // Date du jour au format YYYY-MM-DD
  const today = format(new Date(), 'yyyy-MM-dd');

  // Valeurs mémorisées pour éviter les recalculs inutiles
  const todayNutrition = useMemo(() => getDailyNutrition(today), [meals, today]);
  const todayMeals = useMemo(() => getMealsForDate(today), [meals, today]);

  return {
    profile,         // Profil utilisateur
    setProfile,      // Modifier le profil
    meals,           // Tous les repas enregistrés
    addMeal,         // Ajouter un repas
    removeMeal,      // Supprimer un repas
    getMealsForDate, // Repas d'une date spécifique
    getDailyNutrition, // Totaux nutritionnels d'une date
    todayNutrition,  // Totaux du jour (mémorisé)
    todayMeals,      // Repas du jour (mémorisé)
    today,           // Date du jour
  };
}
