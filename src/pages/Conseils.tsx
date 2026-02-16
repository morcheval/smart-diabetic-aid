import { useNutrition } from '@/hooks/useNutrition';
import { DIABETES_TYPE_LABELS, getGlycemicImpactLabel } from '@/types/nutrition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Lightbulb, Utensils } from 'lucide-react';

interface Tip {
  icon: React.ReactNode;
  title: string;
  text: string;
  type: 'success' | 'warning' | 'info';
}

export default function Conseils() {
  const { profile, todayNutrition, todayMeals } = useNutrition();

  const tips: Tip[] = [];

  // Analyze today's meals
  const highGIMeals = todayMeals.filter((m) => m.glycemicIndex > 69);
  const medGIMeals = todayMeals.filter((m) => m.glycemicIndex > 55 && m.glycemicIndex <= 69);

  if (highGIMeals.length > 0) {
    tips.push({
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      title: 'Aliments à IG élevé détectés',
      text: `Vous avez consommé ${highGIMeals.map(m => m.foodName).join(', ')} qui ${highGIMeals.length > 1 ? 'ont' : 'a'} un index glycémique élevé. Associez-les avec des fibres ou protéines pour limiter le pic glycémique.`,
      type: 'warning',
    });
  }

  if (todayNutrition.carbs > profile.carbGoal) {
    tips.push({
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      title: 'Objectif glucides dépassé',
      text: `Vous avez consommé ${Math.round(todayNutrition.carbs)}g de glucides sur un objectif de ${profile.carbGoal}g. Privilégiez les protéines et légumes verts pour le reste de la journée.`,
      type: 'warning',
    });
  }

  if (todayNutrition.fiber > 25) {
    tips.push({
      icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
      title: 'Excellent apport en fibres !',
      text: `Avec ${Math.round(todayNutrition.fiber)}g de fibres, vous êtes au-dessus des recommandations. Les fibres aident à ralentir l'absorption des glucides.`,
      type: 'success',
    });
  }

  if (todayNutrition.protein < profile.proteinGoal * 0.5 && todayMeals.length > 0) {
    tips.push({
      icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
      title: 'Pensez aux protéines',
      text: 'Votre apport en protéines est encore faible. Ajoutez du poulet, du poisson, des œufs ou des légumineuses à vos prochains repas.',
      type: 'info',
    });
  }

  // General tips based on diabetes type
  const diabeteTips: Record<string, Tip[]> = {
    type1: [
      { icon: <Lightbulb className="h-5 w-5 text-blue-500" />, title: 'Comptage des glucides', text: 'Pour le diabète de Type 1, le comptage précis des glucides est essentiel pour ajuster vos doses d\'insuline. Pesez vos aliments quand c\'est possible.', type: 'info' },
      { icon: <Utensils className="h-5 w-5 text-primary" />, title: 'Repas réguliers', text: 'Essayez de manger à heures régulières pour faciliter la gestion de votre glycémie et l\'ajustement de l\'insuline.', type: 'info' },
    ],
    type2: [
      { icon: <Lightbulb className="h-5 w-5 text-blue-500" />, title: 'Activité physique', text: 'Pour le diabète de Type 2, l\'activité physique régulière améliore la sensibilité à l\'insuline. Visez 150 minutes par semaine.', type: 'info' },
      { icon: <Utensils className="h-5 w-5 text-primary" />, title: 'Méthode de l\'assiette', text: 'Remplissez la moitié de votre assiette de légumes, un quart de protéines et un quart de féculents complets.', type: 'info' },
    ],
    gestational: [
      { icon: <Lightbulb className="h-5 w-5 text-blue-500" />, title: 'Collations régulières', text: 'Pendant la grossesse, mangez 3 repas et 2-3 collations par jour pour maintenir une glycémie stable.', type: 'info' },
      { icon: <Utensils className="h-5 w-5 text-primary" />, title: 'Petit-déjeuner protéiné', text: 'La glycémie est souvent plus difficile à contrôler le matin. Privilégiez un petit-déjeuner riche en protéines et pauvre en glucides.', type: 'info' },
    ],
  };

  tips.push(...(diabeteTips[profile.diabetesType] || []));

  // Meal suggestions
  const suggestions = [
    { name: 'Salade de lentilles et légumes grillés', gi: 'Faible', calories: '350 kcal' },
    { name: 'Poulet grillé avec brocoli et riz complet', gi: 'Moyen', calories: '450 kcal' },
    { name: 'Omelette aux épinards et fromage', gi: 'Faible', calories: '300 kcal' },
    { name: 'Saumon avec patate douce et haricots verts', gi: 'Moyen', calories: '500 kcal' },
  ];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold">Conseils personnalisés</h1>
      <p className="text-sm text-muted-foreground">
        Recommandations adaptées au diabète {DIABETES_TYPE_LABELS[profile.diabetesType]}
      </p>

      {tips.map((tip, i) => (
        <Card
          key={i}
          className={`border-0 shadow-sm ${
            tip.type === 'warning' ? 'bg-amber-500/5' : tip.type === 'success' ? 'bg-primary/5' : ''
          }`}
        >
          <CardContent className="flex gap-3 pt-4">
            {tip.icon}
            <div className="flex-1">
              <p className="text-sm font-semibold mb-0.5">{tip.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Meal suggestions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">💡 Suggestions de repas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">IG {s.gi} · ~{s.calories}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
