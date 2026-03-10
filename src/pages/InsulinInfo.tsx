import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Syringe } from 'lucide-react';

export default function InsulinInfo() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold">Types d'Insuline</h1>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Syringe className="h-5 w-5" /> Insuline Rapide / Ultra-rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Action :</strong> Commence à agir en 5 à 15 minutes. Pic d'action après 1 à 2 heures.</p>
          <p><strong>Usage :</strong> Prise juste avant ou après le repas pour couvrir les glucides consommés.</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Syringe className="h-5 w-5" /> Insuline Basale (Lente)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Action :</strong> Agit sur 24 heures ou plus avec un débit constant.</p>
          <p><strong>Usage :</strong> Maintenir un taux de glycémie stable en dehors des repas et pendant la nuit.</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Syringe className="h-5 w-5" /> Insuline Mixte
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Action :</strong> Mélange d'insuline rapide et intermédiaire.</p>
          <p><strong>Usage :</strong> Permet de couvrir à la fois le repas et la période qui suit avec une seule injection.</p>
        </CardContent>
      </Card>

      <div className="bg-amber-50 p-4 rounded-xl flex gap-3 border border-amber-200">
        <Info className="h-5 w-5 text-amber-500 shrink-0" />
        <p className="text-xs text-amber-700">La conservation de l'insuline est cruciale : gardez vos stocks au réfrigérateur (2-8°C) et le stylo en cours à température ambiante (max 25-30°C) pendant 4 semaines.</p>
      </div>
    </div>
  );
}
