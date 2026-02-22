/**
 * components/BottomNav.tsx — Barre de navigation fixe en bas de l'écran
 * 
 * Affiche 5 onglets de navigation avec icônes :
 * - Accueil (Dashboard)
 * - Scanner (ajout d'aliments)
 * - Journal (historique des repas)
 * - Insuline (suivi des injections)
 * - Profil (paramètres utilisateur)
 * 
 * L'onglet actif est mis en surbrillance avec la couleur primaire.
 * Le fond est semi-transparent avec un effet de flou (backdrop-blur).
 */

import { NavLink } from 'react-router-dom';
import { Home, Search, BookOpen, Syringe, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Définition des onglets de navigation
const navItems = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/scanner', icon: Search, label: 'Scanner' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/insulin', icon: Syringe, label: 'Insuline' },
  { to: '/profile', icon: User, label: 'Profil' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/80 backdrop-blur-xl safe-area-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'} // "end" évite que "/" soit actif sur toutes les routes
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors rounded-xl',
                isActive
                  ? 'text-primary'                    // Onglet actif : couleur primaire
                  : 'text-muted-foreground hover:text-foreground' // Inactif : gris
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Icône avec fond coloré quand l'onglet est actif */}
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
                  isActive && 'bg-primary/10 scale-110'
                )}>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
