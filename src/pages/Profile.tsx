import { useNutrition } from '@/hooks/useNutrition';
import { DIABETES_TYPE_LABELS, DiabetesType } from '@/types/nutrition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Heart, Target } from 'lucide-react';

export default function Profile() {
  const { profile, setProfile } = useNutrition();
  const { toast } = useToast();

  const updateField = (field: string, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({ title: '✅ Profil sauvegardé', description: 'Vos préférences ont été mises à jour.' });
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold">Mon profil</h1>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-4xl text-primary-foreground font-bold">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <p className="text-lg font-semibold">{profile.name}</p>
      </div>

      {/* Personal info */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" /> Informations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>
            <Label className="text-xs">Nom</Label>
            <Input value={profile.name} onChange={(e) => updateField('name', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Type de diabète</Label>
            <Select value={profile.diabetesType} onValueChange={(v) => updateField('diabetesType', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DIABETES_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" /> Objectifs quotidiens
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Calories (kcal)</Label>
            <Input type="number" value={profile.calorieGoal} onChange={(e) => updateField('calorieGoal', Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs">Glucides (g)</Label>
            <Input type="number" value={profile.carbGoal} onChange={(e) => updateField('carbGoal', Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs">Protéines (g)</Label>
            <Input type="number" value={profile.proteinGoal} onChange={(e) => updateField('proteinGoal', Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs">Lipides (g)</Label>
            <Input type="number" value={profile.fatGoal} onChange={(e) => updateField('fatGoal', Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full gap-2">
        <Heart className="h-4 w-4" />
        Sauvegarder
      </Button>

      <p className="text-center text-[10px] text-muted-foreground">NutriAI v1.0 · Données stockées localement</p>
    </div>
  );
}
