import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNutrition } from '@/hooks/useNutrition';
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS, MealEntry, getGlycemicImpactLabel } from '@/types/nutrition';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export default function Journal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getMealsForDate, getDailyNutrition, removeMeal, profile } = useNutrition();

  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const meals = getMealsForDate(dateStr);
  const nutrition = getDailyNutrition(dateStr);

  const mealTypes: MealEntry['mealType'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold">Journal alimentaire</h1>

      {/* Date nav */}
      <div className="flex items-center justify-between rounded-xl bg-muted p-2">
        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subDays(currentDate, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <p className="text-sm font-semibold capitalize">
          {format(currentDate, 'EEEE d MMMM', { locale: fr })}
        </p>
        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Daily summary */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'Calories', value: `${Math.round(nutrition.calories)}`, unit: 'kcal' },
          { label: 'Glucides', value: `${Math.round(nutrition.carbs)}`, unit: 'g' },
          { label: 'Protéines', value: `${Math.round(nutrition.protein)}`, unit: 'g' },
          { label: 'Lipides', value: `${Math.round(nutrition.fat)}`, unit: 'g' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-muted/50 p-2">
            <p className="text-lg font-bold">{item.value}</p>
            <p className="text-[10px] text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Meals by type */}
      {mealTypes.map((type) => {
        const typeMeals = meals.filter((m) => m.mealType === type);
        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-2">
              <span>{MEAL_TYPE_ICONS[type]}</span>
              <h2 className="text-sm font-semibold">{MEAL_TYPE_LABELS[type]}</h2>
              <span className="text-xs text-muted-foreground">({typeMeals.length})</span>
            </div>
            {typeMeals.length === 0 ? (
              <p className="text-xs text-muted-foreground ml-7 mb-2">Aucun aliment</p>
            ) : (
              <div className="flex flex-col gap-1.5 mb-2">
                {typeMeals.map((meal) => (
                  <Card key={meal.id} className="border-0 shadow-sm">
                    <CardContent className="flex items-center gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{meal.foodName}</p>
                        <p className="text-xs text-muted-foreground">{meal.quantity}g · {Math.round(meal.calories)} kcal</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeMeal(meal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
