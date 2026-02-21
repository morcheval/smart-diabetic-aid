
# Insulines habituelles dans le Profil + pré-remplissage du formulaire

## Objectif
Permettre au patient de configurer ses insulines habituelles (nom, type, dose, moment) dans son profil, puis de les sélectionner en un tap dans le formulaire d'injection pour un remplissage automatique.

## Ce qui change

### 1. Nouveau type `InsulinPreset` dans `src/types/insulin.ts`
Ajout d'une interface :
```
InsulinPreset {
  id: string
  name: string          // ex: "Novorapid"
  insulin_type: InsulinType  // rapide | lente | mixte
  default_dose: number       // ex: 8
  meal_context: MealContext  // ex: avant_repas
}
```

### 2. Extension du profil utilisateur dans `src/types/nutrition.ts`
Ajout d'un champ optionnel `insulinPresets: InsulinPreset[]` dans l'interface `UserProfile`.

### 3. Mise a jour du hook `src/hooks/useNutrition.ts`
Le `DEFAULT_PROFILE` inclura `insulinPresets: []` par defaut. Le stockage localStorage existant gere deja les mises a jour du profil.

### 4. Nouvelle section dans `src/pages/Profile.tsx`
Ajout d'une carte "Insulines habituelles" (icone Syringe) entre les objectifs et le bouton sauvegarder :
- Liste des presets existants avec nom, type (badge colore), dose et contexte
- Bouton de suppression par preset
- Formulaire d'ajout en bas de la carte : nom de l'insuline, type, dose par defaut, contexte habituel, bouton "Ajouter"
- Si aucune insuline configuree, un message d'aide s'affiche

### 5. Modification du formulaire d'injection dans `src/pages/Insulin.tsx`
Dans le composant `RegisterTab` :
- Ajout d'une barre horizontale de boutons-raccourcis en haut du formulaire, un par preset configure
- Chaque bouton affiche le nom de l'insuline et la dose (ex: "Novorapid 8U")
- Au clic, les champs type, nom, dose et contexte sont pre-remplis automatiquement
- Le patient peut toujours modifier les valeurs avant d'enregistrer
- Si aucun preset, cette section n'apparait pas

## Flux utilisateur

```text
1. Profil → Section "Insulines habituelles"
   → Ajouter "Novorapid" / Rapide / 8U / Avant repas
   → Ajouter "Lantus" / Lente / 20U / Coucher

2. Page Insuline → Onglet Enregistrer
   → Boutons raccourcis : [Novorapid 8U] [Lantus 20U]
   → Clic sur "Novorapid 8U"
   → Formulaire pre-rempli : type=Rapide, nom=Novorapid, dose=8, contexte=Avant repas
   → Ajuster si besoin → Enregistrer
```

## Fichiers modifies

| Fichier | Modification |
|---------|-------------|
| `src/types/insulin.ts` | Ajout interface `InsulinPreset` |
| `src/types/nutrition.ts` | Ajout `insulinPresets` dans `UserProfile` |
| `src/hooks/useNutrition.ts` | Default vide pour `insulinPresets` |
| `src/pages/Profile.tsx` | Nouvelle carte avec gestion CRUD des presets |
| `src/pages/Insulin.tsx` | Boutons raccourcis en haut du formulaire `RegisterTab` |

## Details techniques

- Les presets sont stockes dans localStorage (comme le reste du profil), pas en base de donnees -- coherent avec l'architecture actuelle du profil
- Le hook `useNutrition` est deja utilise pour le profil, on y accede aussi depuis `Insulin.tsx`
- Aucune migration de base de donnees necessaire
- Les composants UI utilises sont ceux deja presents : Card, Input, Select, Button, Badge
