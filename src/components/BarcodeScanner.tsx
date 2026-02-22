/**
 * components/BarcodeScanner.tsx — Scanner de code-barres alimentaire
 * 
 * Utilise la caméra du téléphone pour scanner un code-barres de produit alimentaire.
 * Une fois le code-barres détecté, il interroge l'API Open Food Facts pour
 * récupérer les informations nutritionnelles du produit.
 * 
 * Bibliothèque utilisée : html5-qrcode (détection de code-barres via la caméra)
 * API externe : Open Food Facts (base de données libre de produits alimentaires)
 */

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/** Structure des données nutritionnelles d'un produit scanné */
interface ScannedFood {
  name: string;
  calories: number;   // kcal pour 100g
  carbs: number;      // Glucides en g pour 100g
  protein: number;    // Protéines en g pour 100g
  fat: number;        // Lipides en g pour 100g
  fiber: number;      // Fibres en g pour 100g
  image?: string;     // URL de la photo du produit (Open Food Facts)
  brand?: string;     // Marque du produit
  barcode: string;    // Code-barres EAN
}

interface BarcodeScannerProps {
  open: boolean;                               // Le dialog est-il ouvert ?
  onOpenChange: (open: boolean) => void;       // Callback pour ouvrir/fermer
  onFoodScanned: (food: ScannedFood) => void;  // Callback quand un produit est trouvé
}

export default function BarcodeScanner({ open, onOpenChange, onFoodScanned }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false);     // Caméra active
  const [loading, setLoading] = useState(false);       // Recherche du produit en cours
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null); // Instance du scanner
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  /** Arrête la caméra et libère les ressources */
  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        // Ignorer les erreurs d'arrêt (peut arriver si déjà arrêté)
      }
    }
    scannerRef.current = null;
    setScanning(false);
  };

  /**
   * Recherche un produit sur Open Food Facts à partir de son code-barres.
   * L'API retourne les informations nutritionnelles pour 100g.
   */
  const lookupBarcode = async (barcode: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();

      // Vérifie que le produit existe dans la base
      if (data.status !== 1 || !data.product) {
        setError('Produit non trouvé. Essayez un autre code-barres.');
        setLoading(false);
        return;
      }

      const p = data.product;
      const n = p.nutriments || {};

      // Construit l'objet avec les données nutritionnelles normalisées
      const food: ScannedFood = {
        name: p.product_name_fr || p.product_name || 'Produit inconnu',
        calories: Math.round(n['energy-kcal_100g'] || n['energy-kcal'] || 0),
        carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
        protein: Math.round((n.proteins_100g || 0) * 10) / 10,
        fat: Math.round((n.fat_100g || 0) * 10) / 10,
        fiber: Math.round((n.fiber_100g || 0) * 10) / 10,
        image: p.image_front_small_url || p.image_url,
        brand: p.brands,
        barcode,
      };

      // Transmet le résultat au composant parent et ferme le scanner
      onFoodScanned(food);
      onOpenChange(false);
      toast({ title: '✅ Produit scanné', description: food.name });
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  /** Démarre la caméra et commence la détection de code-barres */
  const startScanner = async () => {
    setError(null);
    const readerId = 'barcode-reader';
    
    // Petit délai pour s'assurer que le DOM est prêt
    await new Promise((r) => setTimeout(r, 300));

    const el = document.getElementById(readerId);
    if (!el) return;

    try {
      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;
      setScanning(true);

      // Lance le scanner avec la caméra arrière
      await scanner.start(
        { facingMode: 'environment' },  // Caméra arrière
        { fps: 10, qrbox: { width: 250, height: 150 } }, // Zone de détection
        async (decodedText) => {
          // Code-barres détecté ! On arrête la caméra et on recherche le produit
          await stopScanner();
          await lookupBarcode(decodedText);
        },
        () => {
          // Callback appelé à chaque frame sans détection — on l'ignore
        }
      );
    } catch (err: any) {
      setScanning(false);
      if (err?.toString().includes('NotAllowedError')) {
        setError("Accès caméra refusé. Autorisez l'accès dans les paramètres du navigateur.");
      } else {
        setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      }
    }
  };

  // Démarre le scanner quand le dialog s'ouvre, l'arrête quand il se ferme
  useEffect(() => {
    if (open) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [open]);

  /** Gère la fermeture du dialog en arrêtant d'abord le scanner */
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      stopScanner();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Scanner un code-barres
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* Zone d'affichage de la caméra pour le scan */}
          <div
            id="barcode-reader"
            ref={containerRef}
            className="w-full rounded-xl overflow-hidden bg-muted min-h-[250px]"
          />

          {/* Indicateur de recherche du produit */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Recherche du produit...</p>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive text-center">
              {error}
            </div>
          )}

          {/* Bouton pour relancer le scanner si arrêté */}
          {!scanning && !loading && (
            <Button onClick={startScanner} className="w-full gap-2">
              <Camera className="h-4 w-4" />
              Relancer le scanner
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Placez le code-barres devant la caméra. Les données proviennent d'Open Food Facts.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
