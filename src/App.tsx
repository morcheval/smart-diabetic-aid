/**
 * App.tsx — Composant racine de l'application
 * 
 * Ce fichier configure :
 * - Le routeur (navigation entre les pages)
 * - Les providers globaux (React Query, Tooltips, Toasts)
 * - La mise en page générale (conteneur max-width, padding, barre de navigation)
 * 
 * Structure de l'app :
 * /           → Dashboard (page d'accueil avec résumé nutritionnel)
 * /scanner    → Scanner d'aliments (recherche, code-barres, photo IA)
 * /journal    → Journal alimentaire (historique des repas par jour)
 * /stats      → Statistiques (graphiques macros, calories hebdo)
 * /profile    → Profil utilisateur (objectifs, insulines habituelles)
 * /conseils   → Conseils personnalisés selon le type de diabète
 * /insulin    → Suivi des injections d'insuline et glycémie
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Journal from "./pages/Journal";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import Conseils from "./pages/Conseils";
import Insulin from "./pages/Insulin";
import DiabetesInfo from "./pages/DiabetesInfo";
import InsulinInfo from "./pages/InsulinInfo";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

// Client React Query pour gérer les requêtes asynchrones (fetch, cache, mutations)
const queryClient = new QueryClient();

const App = () => (
  // QueryClientProvider : fournit le cache de requêtes à toute l'app
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider : active les infobulles partout dans l'app */}
    <TooltipProvider>
      {/* Systèmes de notifications (toasts) — deux variantes disponibles */}
      <Toaster />
      <Sonner />
      {/* Routeur : gère la navigation sans rechargement de page (SPA) */}
      <BrowserRouter>
        {/* Conteneur principal : centré, largeur max mobile, fond thémé */}
        <div className="mx-auto min-h-screen max-w-md bg-background">
          {/* Zone de contenu avec padding et espace pour la barre de nav en bas */}
          <main className="px-4 pt-4 pb-24">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/conseils" element={<Conseils />} />
              <Route path="/insulin" element={<Insulin />} />
              <Route path="/diabetes-info" element={<DiabetesInfo />} />
              <Route path="/insulin-info" element={<InsulinInfo />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {/* Barre de navigation fixe en bas de l'écran */}
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
