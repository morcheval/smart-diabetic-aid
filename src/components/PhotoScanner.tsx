/**
 * components/PhotoScanner.tsx — Scanner de plats par photo avec analyse IA
 * 
 * Permet à l'utilisateur de :
 * 1. Prendre une photo d'un plat ou choisir une image
 * 2. Envoyer la photo à l'IA pour analyse nutritionnelle
 * 3. Voir les résultats (calories, macros, IG, conseils)
 * 4. Ajuster la quantité et le type de repas
 * 5. Ajouter le plat au journal alimentaire
 * 
 * L'analyse utilise une Edge Function (analyze-food-photo) qui appelle
 * l'IA avec la photo en base64 pour obtenir les valeurs nutritionnelles.
 * Le résultat est aussi sauvegardé dans la table food_scans en base de données.
 */

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Loader2, Plus, Flame, Wheat, Beef, Droplets, Leaf, AlertCircle, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNutrition } from '@/hooks/useNutrition';
import { MealEntry, MEAL_TYPE_LABELS } from '@/types/nutrition';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

/** Structure du résultat retourné par l'IA après analyse de la photo */
interface FoodAnalysis {
  name: string;           // Nom du plat identifié
  description: string;    // Description courte
  calories: number;       // Calories estimées (kcal)
  carbs: number;          // Glucides (g)
  protein: number;        // Protéines (g)
  fat: number;            // Lipides (g)
  fiber: number;          // Fibres (g)
  sugar: number;          // Sucre (g)
  salt: number;           // Sel (g)
  glycemic_index: number; // Index glycémique estimé
  items: string[];        // Liste des aliments identifiés dans le plat
  advice: string;         // Conseil nutritionnel pour diabétique
}

export default function PhotoScanner() {
  // ─── États du composant ────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);           // Dialog ouvert/fermé
  const [loading, setLoading] = useState(false);     // Analyse en cours
  const [preview, setPreview] = useState<string | null>(null);  // Aperçu de la photo (data URL)
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null); // Résultat IA
  const [error, setError] = useState<string | null>(null);     // Message d'erreur
  const [quantity, setQuantity] = useState('100');    // Quantité en grammes
  const [mealType, setMealType] = useState<MealEntry['mealType']>('lunch'); // Type de repas
  const [photoFile, setPhotoFile] = useState<File | null>(null); // Fichier photo original
  const fileRef = useRef<HTMLInputElement>(null);     // Référence vers l'input file caché
  const { addMeal, today } = useNutrition();
  const { toast } = useToast();

  /** Remet tous les états à zéro */
  const reset = () => {
    setPreview(null);
    setAnalysis(null);
    setError(null);
    setPhotoFile(null);
    setQuantity('100');
  };

  /** Gère la sélection/capture d'une photo par l'utilisateur */
  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setError(null);
    setAnalysis(null);

    // Convertit le fichier en data URL pour l'aperçu
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  /** Envoie la photo à l'Edge Function pour analyse par l'IA */
  const analyzePhoto = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);

    try {
      // Extrait le base64 sans le préfixe "data:image/jpeg;base64,"
      const base64 = preview.split(',')[1];

      // Appelle l'Edge Function analyze-food-photo
      const { data, error: fnError } = await supabase.functions.invoke('analyze-food-photo', {
        body: { imageBase64: base64 },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setAnalysis(data as FoodAnalysis);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  /** Ajoute le plat analysé au journal alimentaire + sauvegarde en base */
  const handleAdd = async () => {
    if (!analysis) return;
    const qty = Number(quantity) || 100;
    const ratio = qty / 100; // Ratio pour ajuster les valeurs selon la quantité

    // Permet l'édition manuelle des valeurs avant ajout si nécessaire
    // (L'interface affiche les valeurs de 'analysis' mais on pourrait les mapper à des états éditables)

    // Upload de la photo dans le stockage (bucket food-photos)
    let photoUrl: string | undefined;
    if (photoFile) {
      const fileName = `${Date.now()}-${photoFile.name}`;
      const { data: uploadData } = await supabase.storage
        .from('food-photos')
        .upload(fileName, photoFile);

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from('food-photos')
          .getPublicUrl(uploadData.path);
        photoUrl = urlData.publicUrl;
      }
    }

    // Sauvegarde le scan dans la table food_scans (base de données)
    try {
      await supabase.from('food_scans').insert({
        food_name: analysis.name,
        calories: analysis.calories,
        carbs: analysis.carbs,
        protein: analysis.protein,
        fat: analysis.fat,
        fiber: analysis.fiber,
        glycemic_index: analysis.glycemic_index,
        photo_url: photoUrl,
        ai_description: analysis.description,
        scan_type: 'photo',
      });
    } catch (e) {
      console.error("Erreur sauvegarde scan:", e);
    }

    // Ajoute au journal local (localStorage) avec les valeurs ajustées à la quantité
    addMeal({
      foodId: `photo-${Date.now()}`,
      foodName: analysis.name,
      mealType,
      quantity: qty,
      calories: analysis.calories * ratio,
      carbs: analysis.carbs * ratio,
      protein: analysis.protein * ratio,
      fat: analysis.fat * ratio,
      fiber: analysis.fiber * ratio,
      sugar: (analysis.sugar || 0) * ratio,
      salt: (analysis.salt || 0) * ratio,
      glycemicIndex: analysis.glycemic_index,
      date: today,
      time: format(new Date(), 'HH:mm'),
    });

    toast({ title: '✅ Plat analysé et ajouté', description: `${analysis.name} ajouté au ${MEAL_TYPE_LABELS[mealType].toLowerCase()}` });
    reset();
    setOpen(false);
  };

  return (
    <>
      {/* Bouton pour ouvrir le scanner photo */}
      <Button onClick={() => { reset(); setOpen(true); }} variant="outline" size="sm" className="gap-2">
        <ImageIcon className="h-4 w-4" />
        Photo
      </Button>

      {/* Dialog modal du scanner photo */}
      <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); setOpen(o); }}>
        <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Analyser un plat par photo
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {/* Zone de capture photo — affiche le bouton ou l'aperçu */}
            {!preview ? (
              <div
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/30 p-8 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Camera className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Prendre une photo ou choisir une image
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment" // Ouvre la caméra arrière sur mobile
                  onChange={handleCapture}
                  className="hidden"
                />
              </div>
            ) : (
              <>
                {/* Aperçu de la photo capturée */}
                <img src={preview} alt="Photo du plat" className="w-full rounded-xl object-cover max-h-48" />

                {/* Bouton "Analyser" — visible uniquement avant l'analyse */}
                {!analysis && !loading && (
                  <Button onClick={analyzePhoto} className="w-full gap-2">
                    <Camera className="h-4 w-4" />
                    Analyser avec l'IA
                  </Button>
                )}
              </>
            )}

            {/* Indicateur de chargement pendant l'analyse IA */}
            {loading && (
              <div className="flex flex-col items-center gap-2 py-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyse en cours...</p>
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* ─── Résultats de l'analyse IA ─────────────────────────────── */}
            {analysis && (
              <>
                {/* Nom et description du plat identifié */}
                <div className="rounded-xl bg-muted p-3">
                  <p className="font-semibold">{analysis.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{analysis.description}</p>
                  {/* Tags des aliments identifiés dans le plat */}
                  {analysis.items?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {analysis.items.map((item, i) => (
                        <span key={i} className="text-[10px] bg-background rounded-full px-2 py-0.5">{item}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grille des macronutriments */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-muted p-3">
                    <Flame className="mx-auto h-5 w-5 text-orange-500 mb-1" />
                    <p className="text-lg font-bold">{analysis.calories}</p>
                    <p className="text-[10px] text-muted-foreground">kcal</p>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <Wheat className="mx-auto h-5 w-5 text-amber-500 mb-1" />
                    <p className="text-lg font-bold">{analysis.carbs}g</p>
                    <p className="text-[10px] text-muted-foreground">Glucides</p>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <Beef className="mx-auto h-5 w-5 text-red-500 mb-1" />
                    <p className="text-lg font-bold">{analysis.protein}g</p>
                    <p className="text-[10px] text-muted-foreground">Protéines</p>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <Droplets className="mx-auto h-5 w-5 text-blue-500 mb-1" />
                    <p className="text-lg font-bold">{analysis.fat}g</p>
                    <p className="text-[10px] text-muted-foreground">Lipides</p>
                  </div>
                </div>

                {/* Fibres, Sucre, Sel, IG et conseil nutritionnel */}
                <div className="flex items-center gap-2 rounded-xl bg-muted p-3">
                  <Leaf className="h-5 w-5 text-primary shrink-0" />
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Fibres: {analysis.fiber}g</span>
                      <span>Sucre: {analysis.sugar || 0}g</span>
                      <span>Sel: {analysis.salt || 0}g</span>
                    </div>
                    <p className="text-xs font-semibold mt-1">IG: {analysis.glycemic_index}</p>
                    {analysis.advice && <p className="text-xs text-primary mt-1 italic">"{analysis.advice}"</p>}
                  </div>
                </div>

                {/* Sélecteurs de quantité et type de repas */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Quantité (g)</label>
                    <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Repas</label>
                    <Select value={mealType} onValueChange={(v) => setMealType(v as MealEntry['mealType'])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(MEAL_TYPE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bouton pour ajouter au journal */}
                <Button onClick={handleAdd} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter au journal
                </Button>
              </>
            )}

            {/* Bouton pour reprendre une nouvelle photo */}
            {preview && !analysis && !loading && (
              <Button variant="outline" onClick={() => { setPreview(null); setPhotoFile(null); }}>
                Reprendre la photo
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
