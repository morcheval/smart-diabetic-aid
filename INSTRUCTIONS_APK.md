# Guide de génération de l'APK (Android) - DiaNutri AI

Ce projet utilise **Capacitor** pour transformer l'application web en application native Android.

## Pré-requis
1.  **Node.js** installé sur votre machine.
2.  **Android Studio** installé et configuré.
3.  Le code source de ce projet cloné localement.

## Procédure de génération de l'APK

### 1. Préparer les fichiers
Ouvrez votre terminal dans le dossier du projet et lancez :
```bash
npm install
npm run build
```

### 2. Synchroniser avec Android
Transférez les fichiers compilés vers le projet Android :
```bash
npm run cap:sync
```

### 3. Ouvrir dans Android Studio
Lancez Android Studio pour finaliser la compilation :
```bash
npm run cap:open
```
*Si la commande `npm run cap:open` ne fonctionne pas, ouvrez manuellement Android Studio et choisissez "Open an existing project" en sélectionnant le dossier **`android/`** à la racine de ce projet.*

### 4. Générer l'APK
Une fois le projet chargé dans Android Studio :
1.  Attendez que Gradle termine sa synchronisation (barre de progression en bas).
2.  Dans le menu du haut, allez sur **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3.  Une notification apparaîtra en bas à droite une fois terminé. Cliquez sur **locate** pour trouver votre fichier `app-debug.apk`.

## Installation sur smartphone
1.  Transférez le fichier `.apk` sur votre téléphone (via USB, Google Drive, ou autre).
2.  Ouvrez le fichier sur votre téléphone.
3.  Acceptez l'installation de sources inconnues si demandé.
4.  L'application **DiaNutri AI** est maintenant installée !

---
*Note : Pour une version publiée sur le Play Store, il faudra générer un "Signed Bundle" (AAB) au lieu d'un simple APK.*
