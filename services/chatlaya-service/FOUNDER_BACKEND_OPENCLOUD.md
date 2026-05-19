# ChatLAYA Founder — Socle backend + OpenCloud

## Positionnement

ChatLAYA Founder est un produit de KORYXA.

Ce n'est pas un cabinet.

Ce n'est pas seulement un chatbot.

Le backend gère maintenant un vrai objet Founder persistant en base de données, ainsi qu'un workspace documentaire OpenCloud associé au projet.

## Infrastructure

- OpenCloud est hébergé sur un serveur séparé.
- URL publique : `https://cloud.innovaplus.africa`
- Compte technique dédié : `chatlaya_service`
- Authentification : token applicatif OpenCloud
- Le token applicatif est stocké côté ChatLAYA dans `OPENCLOUD_SERVICE_APP_TOKEN`
- Ne jamais utiliser le compte admin pour ChatLAYA
- Ne jamais commit le token
- Rotation recommandee : annuelle, avant le `2027-05-19` pour le token actuel

## Variables d'environnement utilisées

- `OPENCLOUD_ENABLED`
- `OPENCLOUD_BASE_URL`
- `OPENCLOUD_TIMEOUT_S`
- `OPENCLOUD_VERIFY_SSL`
- `OPENCLOUD_SERVICE_USERNAME`
- `OPENCLOUD_SERVICE_APP_TOKEN`
- `OPENCLOUD_SERVICE_PASSWORD` : fallback temporaire, à laisser vide à terme
- `OPENCLOUD_DEFAULT_ROOT_FOLDER`

## Table DB

La table persistante Founder est `app.chatlaya_founder_projects`.

Champs principaux :

- `user_id` / `guest_id` : propriétaire du projet, avec contrainte d'unicité logique sur un seul owner
- `conversation_id` : conversation ChatLAYA liée au projet si disponible
- `title` : titre courant du projet Founder
- `status` : état global du projet
- `current_step` : étape actuelle du parcours Founder
- `project_data` : données métier du projet au format JSONB
- `opencloud_root_folder` : dossier racine OpenCloud utilisé
- `opencloud_project_folder` : nom du dossier projet généré
- `opencloud_project_path` : chemin complet OpenCloud du projet
- `opencloud_workspace` : snapshot JSONB du workspace OpenCloud créé/synchronisé
- `last_opencloud_sync_at` : dernier horodatage de synchronisation OpenCloud

## Dossiers OpenCloud créés

```text
ChatLAYA Founder/
  {Projet Founder}/
    01_Cadrage/
    02_Validation_et_preuves/
    03_Livrables/
    04_Exports/
```

## Routes internes disponibles

- `GET /chatlaya/internal/opencloud/health`
- `POST /chatlaya/internal/opencloud/founder-root/ensure`
- `POST /chatlaya/internal/opencloud/founder-project/ensure`
- `POST /chatlaya/internal/founder-projects`
- `GET /chatlaya/internal/founder-projects`
- `GET /chatlaya/internal/founder-projects/{project_id}`
- `PATCH /chatlaya/internal/founder-projects/{project_id}`
- `POST /chatlaya/internal/founder-projects/{project_id}/archive`

### Précisions

- Toutes ces routes sont internes.
- Toutes exigent le header `X-Internal-Token`.
- Aucune route publique frontend n'est encore branchée.

## Tests validés

- Diagnostic OpenCloud reachability.
- Auth WebDAV par token applicatif avec retour `207`.
- Création du dossier racine Founder avec `201`, puis idempotence `405`.
- Création du workspace projet avec `201`, puis idempotence `405`.
- Création d'un projet DB puis synchronisation du workspace OpenCloud.
- Archivage d’un projet Founder avec conservation du workspace OpenCloud.
- Après archivage, le projet disparaît de la liste active mais reste lisible par ID.
- Lecture `list/get/patch`.
- Cleanup DB + OpenCloud.

## Commits importants

1. `116b2a6` — `feat: archive ChatLAYA Founder projects`
2. `60e4cde` — `feat: update ChatLAYA Founder projects`
3. `8afe605` — `feat: list and read ChatLAYA Founder projects`
4. `552d410` — `feat: create Founder projects with OpenCloud workspace`
5. `70d8d81` — `feat: add ChatLAYA Founder project repository`
6. `2fee968` — `feat: add ChatLAYA Founder projects table`
7. `ae70bb3` — `feat: ensure OpenCloud Founder project workspace`
8. `8c0dc21` — `feat: ensure OpenCloud Founder root folder`
9. `609ec5f` — `feat: validate OpenCloud app token WebDAV diagnostics`

## Prochaine étape recommandée

- Ne pas commencer les agents maintenant.
- Préparer les routes publiques/backend pour le frontend.
- Ensuite brancher les agents Founder.
