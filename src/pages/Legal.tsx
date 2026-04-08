import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertTriangle, Eye } from 'lucide-react';

export default function Legal() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold">Informations Légales</h1>

      <Card className="border-0 shadow-sm border-l-4 border-l-destructive">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" /> Avis de non-responsabilité
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>L'application DiaNutri AI est un outil d'aide à la gestion nutritionnelle et ne constitue en aucun cas un dispositif médical.</p>
          <p><strong>Important :</strong> Les analyses fournies par l'IA (reconnaissance d'aliments et valeurs nutritionnelles) sont des estimations et peuvent être erronées. Vérifiez toujours manuellement les données avant de prendre une décision thérapeutique (comme une injection d'insuline).</p>
          <p>Ne modifiez jamais votre traitement médical sans l'avis préalable de votre médecin.</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Protection des données
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Vos données de santé sont précieuses. Actuellement, DiaNutri AI stocke vos informations localement sur votre appareil.</p>
          <p>Nous nous engageons à respecter la confidentialité de vos informations personnelles conformément au RGPD.</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" /> Accessibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Nous nous efforçons de rendre cette application accessible au plus grand nombre, avec des contrastes élevés et une typographie lisible.</p>
        </CardContent>
      </Card>
    </div>
  );
}
