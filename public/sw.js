/**
 * sw.js — Service Worker pour le mode PWA
 * 
 * Le Service Worker est un script qui tourne en arrière-plan dans le navigateur.
 * Il permet :
 * - L'installation de l'app comme raccourci sur l'écran d'accueil
 * - Un fonctionnement hors-ligne basique (cache des pages déjà visitées)
 * 
 * Stratégie actuelle : "Network first, fallback to cache"
 * → Essaie de charger depuis le réseau, et si pas de connexion,
 *   utilise la version en cache (si disponible).
 */

const CACHE_NAME = 'diabetaid-v1';

// Installation : le SW s'active immédiatement sans attendre la fermeture des onglets
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activation : prend le contrôle de toutes les pages immédiatement
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Essaie le réseau d'abord, et en cas d'échec (hors-ligne), cherche dans le cache
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
