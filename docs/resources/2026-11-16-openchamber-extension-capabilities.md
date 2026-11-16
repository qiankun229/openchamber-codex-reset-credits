# Extensions OpenChamber — référence des 40 capacités

**Date de référence : 16 novembre 2026 — Europe/Paris.**

**Nature :** ressource documentaire réutilisable, indépendante du plan de notre extension.

## Périmètre et mode d’emploi

Cette référence reprend l’étude de la [page officielle Build](https://openchamber.dev/extensions/build/),
y compris ses cinq vues interactives et ses cartes de travail en arrière-plan.
Elle explique ce que chaque capacité permet, son point d’entrée et ses limites principales,
sans la qualifier d’inutile simplement parce qu’elle ne sert pas à notre extension actuelle.

Les **40 capacités sont un regroupement éditorial**, pas une liste officielle de 40 API.
L’étude a couvert **55 points interactifs et 11 cartes d’arrière-plan** :
plusieurs fonctions apparaissent à la fois sur ordinateur, dans les réglages et sur téléphone.
Inversement, une même carte peut regrouper plusieurs capacités, comme les instructions et les skills.
Ce document n’est donc pas un inventaire exhaustif de toutes les méthodes du SDK.

Les noms d’API servent de repères de recherche, pas d’exemples de code prêts à exécuter.
Les fonctions sont **documentées**, mais n’ont pas toutes été testées en application.

### Navigation

- [Affichage et accès — capacités 1 à 11](#affichage-et-accès)
- [Chat, menus et fichiers — capacités 12 à 22](#chat-menus-et-fichiers)
- [Intégrations et téléphone — capacités 23 à 28](#intégrations-et-téléphone)
- [Services et automatisation — capacités 29 à 40](#services-et-automatisation)
- [Versions et compatibilité](#versions-et-compatibilité)
- [Sources et actualisation](#sources-et-actualisation)

## Affichage et accès

### 1. Page plein écran

- **Repères :** `contributes.page` ; configuration mobile de la page.
- **Utilité :** proposer un tableau de bord, un catalogue ou un espace de travail plus large qu’un panneau.
- **À vérifier :** navigation, entrée autonome et prise en charge mobile selon la version.

### 2. Marques sur les sessions et worktrees

- **Repères :** `contributes.marks`, `host.setMark()` côté service.
- **Utilité :** signaler un déploiement, un contrôle en échec ou un état propre à une session, une branche ou un répertoire.
- **À vérifier :** approbation spécifique, durée de vie liée au service et comportement mobile. Publication établie en 2.7.1.

### 3. Panneau de rail, onglet mobile et badge

- **Repères :** `contributes.panel`, `panel.mobile`, `host.setBadge()`.
- **Utilité :** garder une interface accessible près du chat ; signaler une information via un badge.
- **À vérifier :** le badge n’est pas nécessairement un compteur imprimé sur l’icône ; l’API décrit notamment un point et un nombre dans l’infobulle. L’ouverture mobile demande un opt-in.

### 4. Surface visuelle interactive

- **Repères :** `service.surface`, `panel.dock`.
- **Utilité :** afficher un écran distant interactif, avec image diffusée et commandes dockées.
- **À vérifier :** transport des images, contrôle des entrées, ressources consommées et gestion de la prise de contrôle.

### 5. Section dans Work Status

- **Repères :** `contributes.statusSection`, `host.setHeight()`, `host.setStatusControls()`.
- **Utilité :** exposer un état synthétique et des actions à proximité immédiate du chat.
- **À vérifier :** distinguer une section iframe d’une section dessinée par le host depuis une source. Hauteur, cycle de vie et contrôles dépendent du contrat utilisé.

### 6. Présentation des outils dans le chat

- **Repère :** `contributes.tools`.
- **Utilité :** rendre les appels et résultats d’outils plus lisibles : carte, liste, tableau ou autres formats documentés.
- **À vérifier :** cette déclaration de présentation ne crée pas à elle seule l’outil exécutable. Le rendu `card` est publié en 2.7.1.

### 7. Blocs dans les réponses de l’agent

- **Repères :** `contributes.blocks`, `host.onBlock()`, `host.answerBlock()`.
- **Utilité :** afficher un composant métier directement dans une réponse ; permettre une réponse utilisateur depuis ce composant.
- **À vérifier :** arguments du modèle non fiables, conservation de l’état répondu et déclaration des blocs autorisés à répondre. Un bloc ne doit pas exécuter automatiquement un effet sensible.

### 8. Liens et identifiants reconnus

- **Repère :** `contributes.links`.
- **Utilité :** transformer un identifiant ou une URL dans le chat en accès vers un élément de l’extension.
- **À vérifier :** règles de reconnaissance suffisamment précises, autorisations et destination mobile. Publication établie en 2.7.1.

### 9. Toasts

- **Repère :** `host.toast()`.
- **Utilité :** afficher un retour ponctuel dans OpenChamber : confirmation, information ou erreur.
- **À vérifier :** options disponibles dans la version ciblée. Un toast n’est ni une notification système ni un remplacement fiable d’un état d’erreur persistant.

### 10. Fournisseur Git

- **Repères :** `provides: ["source-control"]`, `contributes.sourceControl`.
- **Utilité :** intégrer une forge aux parcours de suivi des issues et pull/merge requests, de revue et de création de travail.
- **À vérifier :** authentification et actions d’écriture ; une fusion ou une mutation distante reste un effet sensible.

### 11. Fournisseur de suivi de tickets

- **Repères :** `provides: ["tracker"]`, `contributes.tracker`.
- **Utilité :** ajouter un gestionnaire de tickets aux vues de suivi, sélecteurs, éléments liés et parcours de travail.
- **À vérifier :** capacités effectivement annoncées : lecture, changement d’état, commentaires et association aux projets. Les jetons sont gérés par le host via le contrat du fournisseur.

**Sources de cette section :** [SDK](https://docs.openchamber.dev/sdk/),
[Host API](https://docs.openchamber.dev/sdk/host/),
[contrat des services 2.7.2](https://github.com/openchamber/openchamber/blob/v2.7.2/packages/sdk/GUEST_SERVICES.md).

## Chat, menus et fichiers

### 12. Entrée dans le menu « + »

- **Repère :** `contributes.attach`.
- **Utilité :** ouvrir un sélecteur pour choisir un élément à joindre au contexte du chat.
- **À vérifier :** autorisations, données partagées et ouverture du sélecteur sur téléphone.

### 13. Élément attaché sous forme de chip

- **Repère :** `host.attach()`.
- **Utilité :** joindre une référence identifiable au composeur, avec un accès vers l’extension.
- **À vérifier :** distinguer le texte destiné au modèle des données de l’interface ; ne jamais attacher de secret. L’ouverture de l’élément sur mobile dépend de la configuration du panneau.

### 14. Commandes slash et accès depuis la palette

- **Repères :** `contributes.commands`, `host.onResolve()`.
- **Utilité :** retrouver un élément via une commande courte, puis le joindre au chat ; le retrouver aussi dans la palette selon le host.
- **À vérifier :** résolution vers un élément plutôt qu’exécution arbitraire, collisions de commandes et version du parcours palette.

### 15. Actions de session et accès depuis la palette

- **Repères :** `contributes.actions`, `where: "session"`.
- **Utilité :** ouvrir l’extension ou déclencher une action liée à la session depuis son menu ou la palette.
- **À vérifier :** mode interface ou arrière-plan ; l’accès éventuel au contenu de la conversation exige un contrat et une approbation adaptés.

### 16. Suggestions dans le menu « @ »

- **Repère :** `contributes.mentions`.
- **Utilité :** chercher un élément du service pendant la saisie, puis résoudre la sélection en contexte pour l’agent.
- **À vérifier :** la recherche saisie atteint le service ; latence et confidentialité doivent être maîtrisées.

### 17. Logos de fournisseurs de modèles

- **Repère :** `contributes.providerLogos`.
- **Utilité :** identifier visuellement un fournisseur dans le sélecteur de modèles et les réglages.
- **À vérifier :** identifiants de fournisseur, ressources graphiques et contraste. Publication établie en 2.7.1.

### 18. Actions sur un message

- **Repères :** `contributes.actions`, `where: "message"`.
- **Utilité :** ouvrir une vue ou exécuter une action à partir du message choisi.
- **À vérifier :** contenu effectivement transmis, permissions et traitement des messages comme entrée non fiable.

### 19. Actions sur du texte sélectionné

- **Repères :** `contributes.actions`, `where: "selection"`.
- **Utilité :** exploiter une sélection sans copier-coller manuellement, par exemple pour une recherche ou une analyse ciblée.
- **À vérifier :** données sensibles dans la sélection, portée du traitement et comportement tactile.

### 20. Éditeur pour un type de fichier

- **Repères :** `contributes.fileEditors`, événements de fichier et de sauvegarde du host.
- **Utilité :** proposer une interface spécialisée pour consulter ou modifier un format depuis Files.
- **À vérifier :** lecture seule, état modifié, snapshots, sauvegarde et format non pris en charge. Le host coordonne la sauvegarde.

### 21. Actions sur une ligne de fichier

- **Repères :** `contributes.actions`, `where: "file"`.
- **Utilité :** proposer une opération métier depuis le menu d’un fichier, en recevant son chemin.
- **À vérifier :** chemin non fiable, accès autorisé et effets destructifs éventuels.

### 22. Actions sur des lignes de diff

- **Repères :** `contributes.actions`, `where: "diff"`.
- **Utilité :** déclencher une analyse ou une action contextualisée sur une plage de changements.
- **À vérifier :** portée de la plage reçue, confidentialité du code et confirmation des effets.

**Sources de cette section :** [actions et commandes](https://docs.openchamber.dev/sdk/#actions-commands-and-the-badge),
[attachements](https://docs.openchamber.dev/sdk/host/#attach-startsession-and-sessionlink),
[mentions](https://docs.openchamber.dev/sdk/host/#rows-in-the--menu),
[éditeurs](https://docs.openchamber.dev/sdk/#an-editor-for-your-file-type).

## Intégrations et téléphone

### 23. Canal de notifications

- **Repères :** `provides: ["notifications"]`, `contributes.notifications`.
- **Utilité :** acheminer les notifications produites par OpenChamber vers un service externe, par exemple une messagerie.
- **À vérifier :** réglages de notification de l’utilisateur, visibilité des fenêtres, permissions et contrat sortant. Ce rôle ne fournit pas à lui seul une API pour émettre n’importe quelle alerte métier.

### 24. Connexion d’un compte d’extension

- **Repères :** `contributes.integration`, `host.request()`, mécanismes de connexion du host.
- **Utilité :** connecter une intégration externe sans exposer son jeton à la page de l’extension.
- **À vérifier :** origine distante autorisée, mode d’authentification et périmètre des requêtes. Les rôles tracker ou notifications possèdent aussi leurs propres déclarations de compte.

### 25. Fournisseur de quotas et carte Usage

- **Repères :** `provides: ["quota"]`, `contributes.quota`.
- **Utilité :** publier les fenêtres de consommation d’un fournisseur dans l’affichage Usage natif.
- **À vérifier :** credentials reçus, confidentialité et distinction entre une fenêtre d’usage et un autre objet métier. Dans le contrat étudié, la projection fournit le compte sélectionné par fournisseur, pas tous les comptes.

### 26. Fournisseur de navigateur pour l’agent

- **Repère :** `provides: ["browser"]`.
- **Utilité :** proposer un service de navigation sélectionnable comme navigateur de l’agent.
- **À vérifier :** contrat propre au rôle, permissions, isolation et données accessibles. La carte Build seule ne décrit pas l’ensemble de ce protocole.

### 27. Popover et feuille mobile

- **Repère :** `mountPopoverAnchor()`.
- **Utilité :** afficher des détails ancrés sur ordinateur et une feuille adaptée au téléphone.
- **À vérifier :** focus, fermeture, dimensions et interaction tactile dans les versions ciblées.

### 28. Gestion des extensions par le host

- **Repère :** Settings → Extensions ; aucune API « Uses » indiquée pour ce point de la carte.
- **Utilité :** installer, approuver, suspendre, mettre à jour ou supprimer une extension.
- **À vérifier :** il s’agit d’une fonction d’OpenChamber, pas d’une API à réimplémenter dans l’extension. Certains détails du parcours mobile divergent entre les sources.

**Sources de cette section :** [notifications](https://docs.openchamber.dev/sdk/host/#notification-channels),
[comptes](https://docs.openchamber.dev/sdk/#accounts-and-network),
[Usage](https://docs.openchamber.dev/sdk/host/#usage-providers),
[mobile](https://docs.openchamber.dev/sdk/#on-the-phone),
[gestion des extensions](https://docs.openchamber.dev/extensions/).

## Services et automatisation

Le titre « travail sans fenêtre ouverte » de la carte ne signifie pas que toute méthode
`host.*` est disponible depuis un processus de service. Distinguer le client de page
créé par `connectHost()` et le contrat de service créé par `createServiceHost()`.

### 29. Service maintenu ou planifié

- **Repères :** `service.keepRunning`, `service.schedule`.
- **Utilité :** maintenir une connexion, surveiller un système ou exécuter une vérification périodique sans panneau ouvert.
- **À vérifier :** consommation de ressources, démarrage, fuseau horaire et reprise. Une échéance manquée pendant un arrêt n’est pas automatiquement rattrapée.

### 30. Événements de session

- **Repère :** `contributes.sessionEvents`.
- **Utilité :** réagir aux événements documentés : création, fin ou échec de tour, question ou permission, notamment.
- **À vérifier :** événements issus de plusieurs projets, filtrage et approbation supplémentaire pour le contenu. Livraison au plus une fois, sans garantie de replay.

### 31. Contrôle des sessions depuis le service

- **Repères :** `contributes.sessionControl`, méthodes `host.sessions.*` du service.
- **Utilité :** démarrer, alimenter ou arrêter une session ; répondre à certaines demandes si le contrat l’autorise.
- **À vérifier :** droits importants, permissions distinctes pour le contenu et les réponses. Une approbation d’installation ne constitue pas une autorisation générale d’actions sensibles.

### 32. Instructions destinées aux agents

- **Repères :** `contributes.instructions`, `setInstructions()`.
- **Utilité :** ajouter des consignes métier au contexte des agents, pour un répertoire ou globalement selon le contrat.
- **À vérifier :** permission, portée, actualisation et risque d’interférer avec les règles du projet.

### 33. Skills destinés aux agents

- **Repère :** `contributes.skills`.
- **Utilité :** distribuer des procédures spécialisées avec l’extension.
- **À vérifier :** maintenance, contenu chargé dans le contexte et cohérence avec les capacités réellement disponibles.

### 34. Plugin OpenCode embarqué

- **Repère :** `contributes.opencodePlugin`.
- **Utilité :** installer ensemble l’interface OpenChamber et un plugin OpenCode, par exemple pour fournir les outils associés.
- **À vérifier :** compatibilité et exécution avec les droits de l’utilisateur. Ce n’est pas une exécution sandboxée par défaut.

### 35. Attente et réveil d’une session

- **Repère :** `contributes.waits`.
- **Utilité :** laisser l’agent terminer son tour pendant une attente, puis reprendre lorsque le service signale un résultat.
- **À vérifier :** identité de l’attente, fin fiable et sémantique de reprise. Publication établie en 2.7.1 ; un réveil n’autorise pas automatiquement un effet irréversible.

### 36. Génération ponctuelle avec le Small Model

- **Repère :** `host.generate()`.
- **Utilité :** produire un titre, une reformulation ou une synthèse hors d’une conversation complète.
- **À vérifier :** permission modèle, coût, données envoyées, erreurs et résultat arrivé après fermeture de la vue. Vérifier le contexte d’appel autorisé.

### 37. Lecture et écriture de fichiers

- **Repères :** `host.readFile()`, `host.writeFile()`, `host.listDir()`, `host.stat()`, `contributes.filesystem`.
- **Utilité :** manipuler des fichiers du projet ou des chemins extérieurs explicitement déclarés et approuvés.
- **À vérifier :** permissions, limites, validation des chemins et effets d’écriture. Lire un fichier texte ne fournit pas une API de base de données avec gestion des transactions et du WAL.

### 38. Stockage persistant d’extension

- **Repère :** `host.storage`.
- **Utilité :** conserver des préférences, un tableau de bord ou un petit état JSON entre les rechargements.
- **À vérifier :** quotas, distinction entre clé absente et valeur `null`, portée et suppression à la désinstallation. Ce stockage ne doit pas être traité comme un coffre de secrets.

### 39. Suivi des commandes shell en arrière-plan

- **Repères :** `host.onRunningShells()`, lecture de sortie et arrêt de commande.
- **Utilité :** surveiller les tâches lancées par les agents et présenter leur progression.
- **À vérifier :** permission `shells`, portée session/projet/globale, sorties sensibles et rétention limitée. L’arrêt d’une commande a un effet réel.

### 40. Lecture d’OpenCode par le service

- **Repère :** `provides: ["opencode"]`.
- **Utilité :** lire les projets, sessions, messages et événements autorisés depuis l’OpenCode utilisé par OpenChamber.
- **À vérifier :** liste stricte des routes autorisées et confidentialité du contenu. Ce rôle n’ouvre pas toute l’API OpenCode ; la route des credentials est exclue du relais étudié.

**Sources de cette section :** [Host API](https://docs.openchamber.dev/sdk/host/),
[contrat de service 2.7.2](https://github.com/openchamber/openchamber/blob/v2.7.2/packages/sdk/GUEST_SERVICES.md),
[référence API 2.7.2](https://github.com/openchamber/openchamber/blob/v2.7.2/packages/sdk/API.md).

## Versions et compatibilité

### État observé au 16 novembre 2026

- Application stable observée : **OpenChamber 2.7.2**.
- SDK npm stable observé : **`@openchamber/sdk` 2.7.2**.
- Préversion SDK observée : **2.7.3 canary**, distincte de la stable.
- Ce sont des observations datées, pas une affirmation sur la dernière version au moment d’une future lecture.

### Repères de publication

| Version | Date en 2026 | Évolutions pertinentes |
| --- | --- | --- |
| 2.5.3 | 28 octobre | Plusieurs surfaces et déclarations existaient déjà ; la page Build ne liste pas uniquement des nouveautés. |
| 2.6.0 | 2 novembre | Événements de session, canaux de notifications, trackers, UI kit et synchronisation des installations. |
| 2.6.1 | 4 novembre | Correction d’un prompt d’extension envoyé dans un chat existant. |
| 2.7.0 | 8 novembre | Blocs, mentions, contrôle de sessions, rôles OpenCode/quota et plugin OpenCode. |
| 2.7.1 | 12 novembre | Liens, marques, waits, rendu d’outil `card`, logos, page autonome et support mobile annoncé. |
| 2.7.2 | 15 novembre | Accès au microphone. |

Sources : [changelog](https://openchamber.dev/changelog/),
[notes 2.6.0](https://github.com/openchamber/openchamber/blob/v2.6.0/changelog/2.6.0.md),
[notes 2.7.0](https://github.com/openchamber/openchamber/blob/v2.7.0/changelog/2.7.0.md),
[notes 2.7.1](https://github.com/openchamber/openchamber/blob/v2.7.1/changelog/2.7.1.md),
[release 2.7.2](https://github.com/openchamber/openchamber/releases/tag/v2.7.2).
Cette chronologie est ciblée, pas un historique exhaustif de tous les exports.

### À ne pas confondre

1. **Version du SDK compilé** : ce que le code peut importer et typer.
2. **Version de l’hôte OpenChamber** : ce que l’application sait réellement prendre en charge.
3. **Version d’OpenCode** : le contrat du moteur auquel le host se connecte.
4. **Runtime du service** : celui du serveur connecté, pas nécessairement celui du poste client.
5. **Client mobile et hébergement mobile** : consulter une extension sur téléphone ne signifie pas y exécuter son service.

Mettre à jour le SDK ne rend pas une API disponible sur un ancien host.
La documentation courante et la branche `main` peuvent évoluer au-delà d’une version publiée.
Les premières versions de disponibilité n’ont pas été établies pour chaque méthode.

### Précautions transversales

- Vérifier chaque capacité sur la version minimale promise et sur la version cible.
- Vérifier les permissions et toute nouvelle demande d’approbation.
- Les permissions déclarées du service ne constituent pas un sandbox OS.
- Traiter les arguments du modèle, messages, sélections et chemins comme des entrées non fiables.
- Ne pas confondre un badge statique, une action cliquable, un toast et une notification système.
- Prévoir l’échec, la reconnexion et l’absence de replay pour les mécanismes concernés.
- Les sources mobiles étudiées divergent sur certains parcours : tester l’appareil et le host visés avant toute promesse.

### Hors du regroupement des 40

Le microphone (`host.openMicrophone()`), les thèmes, les informations d’appareil et
les composants de l’UI kit sont également des sujets SDK utiles.
Le microphone est annoncé en 2.7.2 mais ne figurait pas comme point distinct
dans la carte inventoriée. Ne pas interpréter le nombre 40 comme une limite du SDK.

## Sources et actualisation

### Sources officielles

- [Carte Build](https://openchamber.dev/extensions/build/) — origine de l’inventaire.
- [SDK](https://docs.openchamber.dev/sdk/) — manifeste et points d’extension.
- [Host API](https://docs.openchamber.dev/sdk/host/) — méthodes et contrats.
- [UI kit](https://docs.openchamber.dev/sdk/ui/) — composants et thèmes.
- [Contrat de service figé en 2.7.2](https://github.com/openchamber/openchamber/blob/v2.7.2/packages/sdk/GUEST_SERVICES.md).
- [Référence API figée en 2.7.2](https://github.com/openchamber/openchamber/blob/v2.7.2/packages/sdk/API.md).
- [Changelog](https://openchamber.dev/changelog/) et [releases](https://github.com/openchamber/openchamber/releases).

Les liens vers le site et `main` sont évolutifs ; les liens tagués permettent de conserver
un point de comparaison historique.

### Preuves locales de l’étude

Ces notes de travail sont conservées localement, sans publication avec le site.
Chemins depuis la racine du dossier de travail :

- Inventaire détaillé : `research_notes/Extensions OpenChamber et SQLite Windows/build-inventory.md`.
- Vérification des versions : `research_notes/Extensions OpenChamber et SQLite Windows/versions-updates.md`.
- Surfaces et mobile : `research_notes/Extensions OpenChamber et SQLite Windows/surfaces-mobile.md`.
- Application à notre extension et SQLite Windows : `reports/Extensions OpenChamber et SQLite Windows.md`.

Pour actualiser cette ressource : relever la nouvelle date et les versions observées,
comparer la carte et les contrats versionnés, puis conserver explicitement les inconnues.
Ne pas remplacer une vérification documentaire par une affirmation de fonctionnement.

**Limites :** ressource issue de l’étude documentaire du 16 novembre 2026 ;
aucune validation exhaustive en application, sur Windows ou sur mobile.
La présence d’une capacité dans cette liste ne garantit pas sa compatibilité avec un ancien host.
