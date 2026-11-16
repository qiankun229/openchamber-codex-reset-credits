# Installer et mettre à jour

## Prérequis

- **OpenChamber 2.5.0 ou ultérieur**, sur bureau ou web, avec les extensions activées.
- **OpenCode 2**, avec des comptes ChatGPT OAuth dans sa base locale par défaut.
- **SQLite intégré au runtime de l’hôte OpenChamber** (`node:sqlite`, ou
  `bun:sqlite` sous Bun), pas à l’appareil qui affiche l’interface web.
  Aucune installation externe de `sqlite3` n’est nécessaire. Sans module intégré,
  le service signale `SQLITE_UNAVAILABLE` ; mettre à jour le SDK seul ne l’ajoute pas.

Le service réutilise brièvement le runtime de l’hôte dans un processus enfant pour
borner les lectures ; il ne cherche ni Node système ni exécutable SQLite dans le PATH.

Seuls `~/.local/share/opencode/opencode.db` et le schéma `credential` observé dans
OpenCode 2 sont pris en charge. Pas de serveur OpenCode distant ni de chemin personnalisé.

## Installer depuis GitHub

1. Ouvrez **Paramètres → Extensions → Ajouter une extension**.
2. Collez l’URL du dépôt :

   ```text
   https://github.com/sofianbll/openchamber-codex-reset-credits
   ```

3. Vérifiez et autorisez le **service hôte**, puis
   activez **Codex resets**. Le service lit les jetons d’accès et contacte ChatGPT
   avec les droits de vos comptes ; [consultez les limites](privacy.md).
4. Ouvrez **Codex resets** dans le rail ou **Work Status**. Les contrôles de section
   de Work Status permettent de l’afficher, la masquer et la réordonner.

Les fichiers compilés sont inclus : ni Bun, ni installation de dépendances, ni
compilation nécessaires. Git doit être disponible pour l’installation par URL.
Le service **n’est pas isolé par une sandbox système**.

## Mises à jour et version fixe

Utilisez les contrôles de mise à jour dans **Paramètres → Extensions**. Pour fixer
la version 0.1.1 une fois publiée :

```text
https://github.com/sofianbll/openchamber-codex-reset-credits#v0.1.1
```

Une URL avec tag reste sur cette version. Sans tag, elle suit la branche par défaut.

## Autre option : archive de version

Une fois publiée, téléchargez l’archive `.tar.gz` précompilée et son empreinte SHA-256
depuis les [Releases GitHub](https://github.com/sofianbll/openchamber-codex-reset-credits/releases).
Vérifiez l’archive avant de l’extraire :

```sh
shasum -a 256 /chemin/vers/archive-telechargee.tar.gz
```

Comparez exactement le résultat avec l’empreinte publiée. Extrayez l’archive dans
un dossier permanent et sélectionnez-le dans **Ajouter une extension**. Pour une
mise à jour par dossier, désactivez l’extension, remplacez-la par la nouvelle version,
puis réactivez-la. Gardez l’ancien dossier pour revenir en arrière.

## Désinstaller

Désactivez ou supprimez l’extension dans **Paramètres → Extensions**. Aucune migration
OpenCode ni restauration de compte n’est nécessaire. Ne supprimez pas votre code
source pour retirer son enregistrement. Désinstaller ou revenir en arrière ne
restitue pas un crédit consommé.
