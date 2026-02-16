import { FoodItem } from '@/types/nutrition';

export const FOOD_DATABASE: FoodItem[] = [
  // Fruits
  { id: 'apple', name: 'Pomme', category: 'Fruits', calories: 52, carbs: 14, protein: 0.3, fat: 0.2, fiber: 2.4, glycemicIndex: 36, servingSize: 150, icon: '🍎' },
  { id: 'banana', name: 'Banane', category: 'Fruits', calories: 89, carbs: 23, protein: 1.1, fat: 0.3, fiber: 2.6, glycemicIndex: 51, servingSize: 120, icon: '🍌' },
  { id: 'orange', name: 'Orange', category: 'Fruits', calories: 47, carbs: 12, protein: 0.9, fat: 0.1, fiber: 2.4, glycemicIndex: 43, servingSize: 130, icon: '🍊' },
  { id: 'strawberry', name: 'Fraises', category: 'Fruits', calories: 32, carbs: 7.7, protein: 0.7, fat: 0.3, fiber: 2, glycemicIndex: 25, servingSize: 150, icon: '🍓' },
  { id: 'grapes', name: 'Raisins', category: 'Fruits', calories: 69, carbs: 18, protein: 0.7, fat: 0.2, fiber: 0.9, glycemicIndex: 59, servingSize: 100, icon: '🍇' },
  { id: 'watermelon', name: 'Pastèque', category: 'Fruits', calories: 30, carbs: 7.6, protein: 0.6, fat: 0.2, fiber: 0.4, glycemicIndex: 76, servingSize: 200, icon: '🍉' },
  { id: 'pear', name: 'Poire', category: 'Fruits', calories: 57, carbs: 15, protein: 0.4, fat: 0.1, fiber: 3.1, glycemicIndex: 38, servingSize: 150, icon: '🍐' },
  // Légumes
  { id: 'carrot', name: 'Carotte', category: 'Légumes', calories: 41, carbs: 10, protein: 0.9, fat: 0.2, fiber: 2.8, glycemicIndex: 39, servingSize: 100, icon: '🥕' },
  { id: 'broccoli', name: 'Brocoli', category: 'Légumes', calories: 34, carbs: 7, protein: 2.8, fat: 0.4, fiber: 2.6, glycemicIndex: 15, servingSize: 100, icon: '🥦' },
  { id: 'tomato', name: 'Tomate', category: 'Légumes', calories: 18, carbs: 3.9, protein: 0.9, fat: 0.2, fiber: 1.2, glycemicIndex: 15, servingSize: 120, icon: '🍅' },
  { id: 'spinach', name: 'Épinards', category: 'Légumes', calories: 23, carbs: 3.6, protein: 2.9, fat: 0.4, fiber: 2.2, glycemicIndex: 15, servingSize: 100, icon: '🥬' },
  { id: 'potato', name: 'Pomme de terre', category: 'Légumes', calories: 77, carbs: 17, protein: 2, fat: 0.1, fiber: 2.2, glycemicIndex: 78, servingSize: 150, icon: '🥔' },
  { id: 'sweetpotato', name: 'Patate douce', category: 'Légumes', calories: 86, carbs: 20, protein: 1.6, fat: 0.1, fiber: 3, glycemicIndex: 63, servingSize: 150, icon: '🍠' },
  // Céréales & Féculents
  { id: 'rice-white', name: 'Riz blanc', category: 'Céréales', calories: 130, carbs: 28, protein: 2.7, fat: 0.3, fiber: 0.4, glycemicIndex: 73, servingSize: 150, icon: '🍚' },
  { id: 'rice-brown', name: 'Riz complet', category: 'Céréales', calories: 111, carbs: 23, protein: 2.6, fat: 0.9, fiber: 1.8, glycemicIndex: 50, servingSize: 150, icon: '🍚' },
  { id: 'pasta', name: 'Pâtes', category: 'Céréales', calories: 131, carbs: 25, protein: 5, fat: 1.1, fiber: 1.8, glycemicIndex: 49, servingSize: 150, icon: '🍝' },
  { id: 'bread-white', name: 'Pain blanc', category: 'Céréales', calories: 265, carbs: 49, protein: 9, fat: 3.2, fiber: 2.7, glycemicIndex: 75, servingSize: 50, icon: '🍞' },
  { id: 'bread-whole', name: 'Pain complet', category: 'Céréales', calories: 247, carbs: 41, protein: 13, fat: 3.4, fiber: 7, glycemicIndex: 51, servingSize: 50, icon: '🍞' },
  { id: 'oats', name: 'Flocons d\'avoine', category: 'Céréales', calories: 389, carbs: 66, protein: 17, fat: 7, fiber: 11, glycemicIndex: 55, servingSize: 40, icon: '🥣' },
  // Protéines
  { id: 'chicken', name: 'Poulet (blanc)', category: 'Protéines', calories: 165, carbs: 0, protein: 31, fat: 3.6, fiber: 0, glycemicIndex: 0, servingSize: 150, icon: '🍗' },
  { id: 'salmon', name: 'Saumon', category: 'Protéines', calories: 208, carbs: 0, protein: 20, fat: 13, fiber: 0, glycemicIndex: 0, servingSize: 150, icon: '🐟' },
  { id: 'egg', name: 'Œuf', category: 'Protéines', calories: 155, carbs: 1.1, protein: 13, fat: 11, fiber: 0, glycemicIndex: 0, servingSize: 60, icon: '🥚' },
  { id: 'beef', name: 'Bœuf (steak)', category: 'Protéines', calories: 250, carbs: 0, protein: 26, fat: 15, fiber: 0, glycemicIndex: 0, servingSize: 150, icon: '🥩' },
  { id: 'tuna', name: 'Thon', category: 'Protéines', calories: 132, carbs: 0, protein: 28, fat: 1.3, fiber: 0, glycemicIndex: 0, servingSize: 150, icon: '🐟' },
  { id: 'lentils', name: 'Lentilles', category: 'Protéines', calories: 116, carbs: 20, protein: 9, fat: 0.4, fiber: 8, glycemicIndex: 32, servingSize: 150, icon: '🫘' },
  // Produits laitiers
  { id: 'milk', name: 'Lait demi-écrémé', category: 'Laitiers', calories: 46, carbs: 5, protein: 3.2, fat: 1.5, fiber: 0, glycemicIndex: 30, servingSize: 250, icon: '🥛' },
  { id: 'yogurt', name: 'Yaourt nature', category: 'Laitiers', calories: 61, carbs: 4.7, protein: 3.5, fat: 3.3, fiber: 0, glycemicIndex: 36, servingSize: 125, icon: '🥛' },
  { id: 'cheese', name: 'Fromage (emmental)', category: 'Laitiers', calories: 357, carbs: 0.4, protein: 27, fat: 28, fiber: 0, glycemicIndex: 0, servingSize: 30, icon: '🧀' },
  // Snacks & Autres
  { id: 'dark-chocolate', name: 'Chocolat noir 70%', category: 'Snacks', calories: 598, carbs: 46, protein: 8, fat: 43, fiber: 11, glycemicIndex: 23, servingSize: 20, icon: '🍫' },
  { id: 'almonds', name: 'Amandes', category: 'Snacks', calories: 579, carbs: 22, protein: 21, fat: 50, fiber: 12, glycemicIndex: 15, servingSize: 30, icon: '🌰' },
  { id: 'honey', name: 'Miel', category: 'Snacks', calories: 304, carbs: 82, protein: 0.3, fat: 0, fiber: 0.2, glycemicIndex: 61, servingSize: 15, icon: '🍯' },
];

export function searchFoods(query: string): FoodItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return FOOD_DATABASE;
  return FOOD_DATABASE.filter(
    (f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  );
}

export function getFoodById(id: string): FoodItem | undefined {
  return FOOD_DATABASE.find((f) => f.id === id);
}
