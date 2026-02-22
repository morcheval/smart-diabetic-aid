/**
 * main.tsx — Point d'entrée de l'application
 * 
 * Ce fichier initialise l'application React et l'insère dans le DOM.
 * Il enregistre aussi le Service Worker pour le mode PWA (installation sur mobile).
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enregistrement du Service Worker pour permettre l'installation en tant que PWA
// Le Service Worker gère le cache et permet un fonctionnement hors-ligne basique
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// Monte le composant racine <App /> dans la div #root du fichier index.html
createRoot(document.getElementById("root")!).render(<App />);
