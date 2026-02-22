/**
 * hooks/useLocalStorage.ts — Hook personnalisé pour persister des données dans le localStorage
 * 
 * Fonctionne comme useState, mais sauvegarde automatiquement la valeur dans le localStorage
 * du navigateur. Les données persistent même après fermeture de l'app.
 * 
 * Utilisé pour stocker : le profil utilisateur, les repas du journal, etc.
 * 
 * ⚠️ Attention : si l'utilisateur vide le cache du navigateur, ces données seront perdues.
 * Les données critiques (scans, injections) sont aussi sauvegardées en base de données.
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialise l'état avec la valeur du localStorage (ou la valeur par défaut)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Setter qui met à jour à la fois le state React ET le localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
