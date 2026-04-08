# Contributing — HomeInOne

## Protection de la branche `master`

La protection de branche doit être configurée manuellement dans les Settings GitHub du dépôt.

**Chemin** : Settings > Branches > Add branch ruleset (ou Branch protection rules)

**Configuration recommandée pour `master`** :

- Require a pull request before merging
  - Required approvals : 1
  - Dismiss stale pull request approvals when new commits are pushed : activé
- Require status checks to pass before merging
  - Require branches to be up to date before merging : activé
  - Status checks requis :
    - `build` (workflow CI)
    - `CodeQL` (workflow CodeQL)
- Do not allow bypassing the above settings

Cette configuration garantit qu'aucun code ne peut être pushé directement sur `master` et que la CI doit être au vert avant tout merge.

## Workflow de contribution

1. Créer une branche depuis `master` : `git checkout -b feat/ma-feature`
2. Développer en respectant les conventions décrites dans `CLAUDE.md`
3. Pousser la branche et ouvrir une Pull Request
4. Remplir le template PR (`.github/PULL_REQUEST_TEMPLATE.md`)
5. Attendre que la CI soit au vert
6. Merger après validation

## CI/CD

| Workflow | Déclencheur | Description |
|---|---|---|
| `ci.yml` | Push / PR sur `master` | Lint, TypeScript, tests |
| `cd.yml` | Push sur `master` | Déploiement Docker |
| `codeql.yml` | Push / PR / hebdomadaire lundi | Analyse sécurité CodeQL |

## Dependabot

Dependabot est configuré pour ouvrir des PRs automatiques chaque lundi pour :
- Les dépendances npm
- Les actions GitHub utilisées dans les workflows
