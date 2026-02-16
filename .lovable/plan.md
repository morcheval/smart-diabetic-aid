

# NutriAI - Expert Diabète

Application mobile-first d'accompagnement nutritionnel pour les personnes diabétiques (Type 1, Type 2, gestationnel).

## 1. Page d'accueil (Dashboard)
- Message de bienvenue personnalisé avec le type de diabète sélectionné
- Résumé du jour : calories, glucides, protéines, lipides consommés
- Indicateur de glycémie estimée
- Derniers repas enregistrés
- Conseils du jour (tips nutritionnels)

## 2. Scanner d'aliments
- Recherche d'aliments par nom (avec une base de données locale d'aliments courants)
- Affichage des informations nutritionnelles : calories, glucides, index glycémique, fibres, protéines, lipides
- Estimation de l'impact glycémique selon le type de diabète
- Possibilité d'ajouter l'aliment au journal

## 3. Journal alimentaire
- Vue calendrier pour naviguer entre les jours
- Liste des repas par jour (petit-déjeuner, déjeuner, dîner, collations)
- Total nutritionnel quotidien
- Possibilité d'ajouter/modifier/supprimer des entrées

## 4. Conseils IA personnalisés
- Recommandations basées sur le profil (type de diabète) et l'historique alimentaire
- Suggestions de repas équilibrés
- Alertes si un repas a un index glycémique élevé

## 5. Tableau de bord / Statistiques
- Graphiques d'évolution hebdomadaire/mensuelle (glucides, calories)
- Répartition des macronutriments (graphique en anneau)
- Tendances et objectifs

## 6. Profil utilisateur
- Sélection du type de diabète (Type 1, Type 2, Gestationnel)
- Objectifs nutritionnels personnalisables
- Préférences (unités, langue)

## Design
- Style mobile-first avec thème vert (palette actuelle conservée)
- Support du mode sombre
- Navigation en barre fixe en bas : Accueil, Scanner, Journal, Stats, Profil
- Design moderne avec cartes arrondies et animations subtiles

## Technique
- Données stockées localement dans le navigateur (localStorage) pour commencer
- Base de données d'aliments intégrée côté client
- Pas de backend pour le moment (ajout ultérieur possible)

