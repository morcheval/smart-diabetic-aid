import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNutrition } from '@/hooks/useNutrition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Stats() {
  const { getDailyNutrition, profile, todayNutrition } = useNutrition();

  // Last 7 days data
  const weekData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const n = getDailyNutrition(dateStr);
      return {
        day: format(date, 'EEE', { locale: fr }),
        calories: Math.round(n.calories),
        carbs: Math.round(n.carbs),
      };
    });
  }, [getDailyNutrition]);

  const macroData = [
    { name: 'Glucides', value: Math.round(todayNutrition.carbs), color: '#f59e0b' },
    { name: 'Protéines', value: Math.round(todayNutrition.protein), color: '#ef4444' },
    { name: 'Lipides', value: Math.round(todayNutrition.fat), color: '#3b82f6' },
  ];

  const totalMacros = macroData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold">Statistiques</h1>

      {/* Macro donut */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Répartition des macros</CardTitle>
        </CardHeader>
        <CardContent>
          {totalMacros === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">Ajoutez des repas pour voir les statistiques</p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="h-36 w-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {macroData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2">
                {macroData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs">{d.name}</span>
                    <span className="text-xs font-bold">{d.value}g</span>
                    <span className="text-[10px] text-muted-foreground">
                      ({totalMacros > 0 ? Math.round((d.value / totalMacros) * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly calories */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Calories (7 derniers jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} width={35} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '0.75rem',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="calories" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly carbs */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Glucides (7 derniers jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} width={35} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '0.75rem',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="carbs" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Objectifs du jour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Calories', current: todayNutrition.calories, goal: profile.calorieGoal, unit: 'kcal' },
              { label: 'Glucides', current: todayNutrition.carbs, goal: profile.carbGoal, unit: 'g' },
              { label: 'Protéines', current: todayNutrition.protein, goal: profile.proteinGoal, unit: 'g' },
              { label: 'Lipides', current: todayNutrition.fat, goal: profile.fatGoal, unit: 'g' },
            ].map((item) => {
              const pct = Math.min(100, (item.current / item.goal) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">{Math.round(item.current)}/{item.goal} {item.unit}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
