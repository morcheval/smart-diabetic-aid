import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScannedFood {
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  image?: string;
  brand?: string;
  barcode: string;
}

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFoodScanned: (food: ScannedFood) => void;
}

export default function BarcodeScanner({ open, onOpenChange, onFoodScanned }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    scannerRef.current = null;
    setScanning(false);
  };

  const lookupBarcode = async (barcode: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();

      if (data.status !== 1 || !data.product) {
        setError('Produit non trouvé. Essayez un autre code-barres.');
        setLoading(false);
        return;
      }

      const p = data.product;
      const n = p.nutriments || {};

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

      onFoodScanned(food);
      onOpenChange(false);
      toast({ title: '✅ Produit scanné', description: food.name });
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const startScanner = async () => {
    setError(null);
    const readerId = 'barcode-reader';
    
    // Small delay to ensure DOM is ready
    await new Promise((r) => setTimeout(r, 300));

    const el = document.getElementById(readerId);
    if (!el) return;

    try {
      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;
      setScanning(true);

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        async (decodedText) => {
          await stopScanner();
          await lookupBarcode(decodedText);
        },
        () => {
          // ignore scan failures
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

  useEffect(() => {
    if (open) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [open]);

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
          <div
            id="barcode-reader"
            ref={containerRef}
            className="w-full rounded-xl overflow-hidden bg-muted min-h-[250px]"
          />

          {loading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Recherche du produit...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive text-center">
              {error}
            </div>
          )}

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
