import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function DiabetesInfo() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold">Types de Diabète</h1>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Le Diabète de Type 1</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Le diabète de type 1 est une maladie auto-immune où le pancréas ne produit plus d'insuline. Il apparaît généralement chez les enfants ou les jeunes adultes.</p>
          <p><strong>Gestion :</strong> Nécessite des injections quotidiennes d'insuline ou l'utilisation d'une pompe à insuline, ainsi qu'une surveillance étroite de la glycémie.</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Le Diabète de Type 2</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>C'est la forme la plus courante. Le corps n'utilise pas bien l'insuline (insulinorésistance) ou n'en produit pas assez.</p>
          <p><strong>Gestion :</strong> Alimentation équilibrée, activité physique, médicaments oraux et parfois insuline.</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Le Diabète Gestationnel (DG)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Le diabète gestationnel survient pendant la grossesse et disparaît généralement après l'accouchement, mais il augmente le risque de développer un diabète de type 2 plus tard.</p>
          <p><strong>Gestion :</strong> Suivi nutritionnel strict, activité physique et parfois insuline.</p>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-xl flex gap-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700">Ces informations sont fournies à titre indicatif. Consultez toujours un professionnel de santé pour un diagnostic et un traitement personnalisé.</p>
      </div>
    </div>
  );
}
