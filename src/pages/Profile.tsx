import { useState } from 'react';
import { useNutrition } from '@/hooks/useNutrition';
import { DIABETES_TYPE_LABELS, DiabetesType } from '@/types/nutrition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Heart, Target, Syringe, Plus, Trash2 } from 'lucide-react';
import {
  InsulinType,
  MealContext,
  InsulinPreset,
  INSULIN_TYPE_LABELS,
  MEAL_CONTEXT_LABELS,
  INSULIN_TYPE_COLORS,
} from '@/types/insulin';

export default function Profile() {
  const { profile, setProfile } = useNutrition();
  const { toast } = useToast();

  const presets = profile.insulinPresets ?? [];

  // Preset form state
  const [presetName, setPresetName] = useState('');
  const [presetType, setPresetType] = useState<InsulinType>('rapide');
  const [presetDose, setPresetDose] = useState('');
  const [presetContext, setPresetContext] = useState<MealContext>('avant_repas');

  const updateField = (field: string, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const addPreset = () => {
    if (!presetName.trim() || !presetDose || Number(presetDose) <= 0) return;
    const newPreset: InsulinPreset = {
      id: crypto.randomUUID(),
      name: presetName.trim(),
      insulin_type: presetType,
      default_dose: Number(presetDose),
      meal_context: presetContext,
    };
    setProfile((prev) => ({ ...prev, insulinPresets: [...(prev.insulinPresets ?? []), newPreset] }));
    setPresetName('');
    setPresetDose('');
    toast({ title: '✅ Insuline ajoutée', description: `${newPreset.name} ${newPreset.default_dose}U configurée.` });
  };

  const removePreset = (id: string) => {
    setProfile((prev) => ({ ...prev, insulinPresets: (prev.insulinPresets ?? []).filter((p) => p.id !== id) }));
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

      {/* Insulin presets */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Syringe className="h-4 w-4" /> Insulines habituelles
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {presets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Configurez vos insulines habituelles pour pré-remplir le formulaire d'injection en un tap.
            </p>
          ) : (
            <div className="space-y-2">
              {presets.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{p.name}</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${INSULIN_TYPE_COLORS[p.insulin_type]}`}>
                      {INSULIN_TYPE_LABELS[p.insulin_type]}
                    </span>
                    <span className="text-sm text-foreground font-medium">{p.default_dose}U</span>
                    <span className="text-xs text-muted-foreground">{MEAL_CONTEXT_LABELS[p.meal_context]}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removePreset(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add form */}
          <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Nom</Label>
                <Input placeholder="ex: Novorapid" value={presetName} onChange={(e) => setPresetName(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Dose (UI)</Label>
                <Input type="number" min="0" step="0.5" placeholder="ex: 8" value={presetDose} onChange={(e) => setPresetDose(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={presetType} onValueChange={(v) => setPresetType(v as InsulinType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.entries(INSULIN_TYPE_LABELS) as [InsulinType, string][]).map(([k, l]) => (
                      <SelectItem key={k} value={k}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Contexte</Label>
                <Select value={presetContext} onValueChange={(v) => setPresetContext(v as MealContext)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.entries(MEAL_CONTEXT_LABELS) as [MealContext, string][]).map(([k, l]) => (
                      <SelectItem key={k} value={k}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-1" onClick={addPreset} disabled={!presetName.trim() || !presetDose}>
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </Button>
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
