import { Link } from 'react-router-dom';
import { useNutrition } from '@/hooks/useNutrition';
import { DIABETES_TYPE_LABELS, MEAL_TYPE_LABELS, MEAL_TYPE_ICONS, getGlycemicImpactLabel } from '@/types/nutrition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, Flame, Droplets, Beef, Wheat, BookOpen, Syringe, ShieldCheck } from 'lucide-react';

const TIPS = [
  "Privilégiez les aliments à index glycémique bas pour stabiliser votre glycémie.",
  "Les fibres ralentissent l'absorption des glucides. Pensez aux légumes verts !",
  "Associez les glucides avec des protéines pour limiter les pics glycémiques.",
  "L'activité physique aide à réguler la glycémie. 30 min de marche par jour suffisent.",
  "Buvez suffisamment d'eau : au moins 1,5L par jour.",
  "Les légumineuses (lentilles, pois chiches) ont un IG bas et sont riches en fibres.",
];

export default function Dashboard() {
  const { profile, todayNutrition, todayMeals } = useNutrition();

  const tip = TIPS[new Date().getDate() % TIPS.length];

  const caloriePercent = Math.min(100, (todayNutrition.calories / profile.calorieGoal) * 100);
  const carbPercent = Math.min(100, (todayNutrition.carbs / profile.carbGoal) * 100);
  const proteinPercent = Math.min(100, (todayNutrition.protein / profile.proteinGoal) * 100);
  const fatPercent = Math.min(100, (todayNutrition.fat / profile.fatGoal) * 100);
  const sugarPercent = Math.min(100, (todayNutrition.sugar / profile.sugarGoal) * 100);
  const saltPercent = Math.min(100, (todayNutrition.salt / profile.saltGoal) * 100);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Bonjour 👋</p>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Leaf className="h-3 w-3" />
            Diabète {DIABETES_TYPE_LABELS[profile.diabetesType]}
          </span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-foreground font-bold">
          {profile.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Calories card */}
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Calories aujourd'hui</p>
              <p className="text-3xl font-bold">{Math.round(todayNutrition.calories)}</p>
              <p className="text-xs text-muted-foreground">/ {profile.calorieGoal} kcal</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary/20">
              <Flame className="h-7 w-7 text-primary" />
            </div>
          </div>
          <Progress value={caloriePercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <Wheat className="mx-auto mb-1 h-5 w-5 text-amber-500" />
            <p className="text-lg font-bold">{Math.round(todayNutrition.carbs)}g</p>
            <p className="text-[10px] text-muted-foreground">Glucides</p>
            <Progress value={carbPercent} className="mt-1.5 h-1" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <Beef className="mx-auto mb-1 h-5 w-5 text-red-500" />
            <p className="text-lg font-bold">{Math.round(todayNutrition.protein)}g</p>
            <p className="text-[10px] text-muted-foreground">Protéines</p>
            <Progress value={proteinPercent} className="mt-1.5 h-1" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <Droplets className="mx-auto mb-1 h-5 w-5 text-blue-500" />
            <p className="text-lg font-bold">{Math.round(todayNutrition.fat)}g</p>
            <p className="text-[10px] text-muted-foreground">Lipides</p>
            <Progress value={fatPercent} className="mt-1.5 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Sugar & Salt */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm bg-accent/20">
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-medium uppercase">Sucre</span>
              <span className="text-sm font-bold">{todayNutrition.sugar.toFixed(1)}g / {profile.sugarGoal}g</span>
            </div>
            <div className="w-16">
              <Progress value={sugarPercent} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-accent/20">
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-medium uppercase">Sel</span>
              <span className="text-sm font-bold">{todayNutrition.salt.toFixed(1)}g / {profile.saltGoal}g</span>
            </div>
            <div className="w-16">
              <Progress value={saltPercent} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tip of the day */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex gap-3 pt-4">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-xs font-semibold text-primary mb-0.5">Conseil du jour</p>
            <p className="text-sm">{tip}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Info */}
      <div className="grid grid-cols-3 gap-2">
        <Link to="/diabetes-info">
          <Card className="border-0 bg-blue-50/50 hover:bg-blue-50 transition-colors">
            <CardContent className="p-2 flex flex-col items-center gap-1">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-medium text-center">Diabète</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/insulin-info">
          <Card className="border-0 bg-purple-50/50 hover:bg-purple-50 transition-colors">
            <CardContent className="p-2 flex flex-col items-center gap-1">
              <Syringe className="h-4 w-4 text-purple-500" />
              <span className="text-[10px] font-medium text-center">Insuline</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/legal">
          <Card className="border-0 bg-amber-50/50 hover:bg-amber-50 transition-colors">
            <CardContent className="p-2 flex flex-col items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              <span className="text-[10px] font-medium text-center">Légal</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent meals */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Repas du jour</h2>
        {todayMeals.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <p className="text-3xl mb-2">🍽️</p>
              <p className="text-sm">Aucun repas enregistré aujourd'hui</p>
              <p className="text-xs">Utilisez le scanner pour ajouter un aliment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {todayMeals.slice(-5).reverse().map((meal) => {
              const gi = getGlycemicImpactLabel(meal.glycemicIndex);
              return (
                <Card key={meal.id} className="border-0 shadow-sm">
                  <CardContent className="flex items-center gap-3 p-3">
                    <span className="text-xl">{MEAL_TYPE_ICONS[meal.mealType]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{meal.foodName}</p>
                      <p className="text-xs text-muted-foreground">
                        {MEAL_TYPE_LABELS[meal.mealType]} · {meal.quantity}g
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{Math.round(meal.calories)} kcal</p>
                      <p className={`text-[10px] font-medium ${gi.color}`}>IG {gi.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
