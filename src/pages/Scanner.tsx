import { useState } from 'react';
import { searchFoods } from '@/data/foods';
import { useNutrition } from '@/hooks/useNutrition';
import { FoodItem, MealEntry, getGlycemicImpactLabel, MEAL_TYPE_LABELS } from '@/types/nutrition';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, X, Flame, Wheat, Beef, Droplets, Leaf } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function Scanner() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('');
  const [mealType, setMealType] = useState<MealEntry['mealType']>('lunch');
  const { addMeal, today, profile } = useNutrition();
  const { toast } = useToast();

  const results = searchFoods(query);

  const handleAdd = () => {
    if (!selected) return;
    const qty = Number(quantity) || selected.servingSize;
    const ratio = qty / 100;

    addMeal({
      foodId: selected.id,
      foodName: selected.name,
      mealType,
      quantity: qty,
      calories: selected.calories * ratio,
      carbs: selected.carbs * ratio,
      protein: selected.protein * ratio,
      fat: selected.fat * ratio,
      fiber: selected.fiber * ratio,
      glycemicIndex: selected.glycemicIndex,
      date: today,
      time: format(new Date(), 'HH:mm'),
    });

    toast({ title: '✅ Aliment ajouté', description: `${selected.name} (${qty}g) ajouté au ${MEAL_TYPE_LABELS[mealType].toLowerCase()}` });
    setSelected(null);
    setQuantity('');
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold">Scanner d'aliments</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un aliment..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['Tous', 'Fruits', 'Légumes', 'Céréales', 'Protéines', 'Laitiers', 'Snacks'].map((cat) => (
          <Button
            key={cat}
            variant={query === (cat === 'Tous' ? '' : cat) ? 'default' : 'outline'}
            size="sm"
            className="shrink-0 rounded-full text-xs"
            onClick={() => setQuery(cat === 'Tous' ? '' : cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="flex flex-col gap-2">
        {results.map((food) => {
          const gi = getGlycemicImpactLabel(food.glycemicIndex);
          return (
            <Card
              key={food.id}
              className="cursor-pointer border-0 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              onClick={() => { setSelected(food); setQuantity(String(food.servingSize)); }}
            >
              <CardContent className="flex items-center gap-3 p-3">
                <span className="text-2xl">{food.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{food.name}</p>
                  <p className="text-xs text-muted-foreground">{food.category} · {food.servingSize}g/portion</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">{food.calories} kcal</p>
                  <p className={`text-[10px] font-medium ${gi.color}`}>IG {food.glycemicIndex} · {gi.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Food detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-sm mx-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-3xl">{selected.icon}</span>
                  {selected.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-muted p-3">
                  <Flame className="mx-auto h-5 w-5 text-orange-500 mb-1" />
                  <p className="text-lg font-bold">{selected.calories}</p>
                  <p className="text-[10px] text-muted-foreground">kcal/100g</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <Wheat className="mx-auto h-5 w-5 text-amber-500 mb-1" />
                  <p className="text-lg font-bold">{selected.carbs}g</p>
                  <p className="text-[10px] text-muted-foreground">Glucides</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <Beef className="mx-auto h-5 w-5 text-red-500 mb-1" />
                  <p className="text-lg font-bold">{selected.protein}g</p>
                  <p className="text-[10px] text-muted-foreground">Protéines</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <Droplets className="mx-auto h-5 w-5 text-blue-500 mb-1" />
                  <p className="text-lg font-bold">{selected.fat}g</p>
                  <p className="text-[10px] text-muted-foreground">Lipides</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-muted p-3">
                <Leaf className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Fibres: {selected.fiber}g/100g</p>
                  <p className={`text-sm font-semibold ${getGlycemicImpactLabel(selected.glycemicIndex).color}`}>
                    Index glycémique: {selected.glycemicIndex} ({getGlycemicImpactLabel(selected.glycemicIndex).label})
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Quantité (g)</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Repas</label>
                  <Select value={mealType} onValueChange={(v) => setMealType(v as MealEntry['mealType'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MEAL_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleAdd} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Ajouter au journal
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
