.PHONY: help dev up down build logs ps shell db-studio db-migrate db-migrate-reset db-generate lint type-check format test

DB_URL=postgresql://homeinone:homeinone@localhost:5432/homeinone

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ── Développement ────────────────────────────────────────────

dev: ## Lance l'app en dev (Docker complet avec hot reload)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

up: ## Lance l'app en arrière-plan
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d

down: ## Arrête tous les containers
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

down-v: ## Arrête les containers ET supprime les volumes (reset complet)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v

build: ## Rebuild l'image Docker
	docker compose -f docker-compose.yml -f docker-compose.dev.yml build

logs: ## Affiche les logs en temps réel
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

logs-app: ## Affiche uniquement les logs de l'app
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f app

ps: ## Affiche l'état des containers
	docker compose -f docker-compose.yml -f docker-compose.dev.yml ps

shell: ## Ouvre un shell dans le container app
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app sh

# ── Base de données ──────────────────────────────────────────

db-migrate: ## Crée et applique une migration (usage: make db-migrate name=description)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx prisma migrate dev --name $(name)

db-migrate-init: ## Applique la migration initiale
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx prisma migrate dev --name init

db-migrate-deploy: ## Applique les migrations en production (sans créer de nouvelle)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx prisma migrate deploy

db-migrate-reset: ## Reset complet de la base et rejoue toutes les migrations
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx prisma migrate reset --force

db-generate: ## Régénère le client Prisma
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx prisma generate

db-studio: ## Ouvre Prisma Studio (interface visuelle de la DB)
	DATABASE_URL="$(DB_URL)" npx prisma studio

db-seed: ## Lance le script de seed
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx prisma db seed

db-status: ## Affiche l'état des migrations
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx prisma migrate status

# ── Qualité ──────────────────────────────────────────────────

lint: ## Lance ESLint
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npm run lint

type-check: ## Vérifie les types TypeScript
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx tsc --noEmit

format: ## Formate le code avec Prettier
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npm run format

test: ## Lance les tests Vitest
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npm test

test-e2e: ## Lance les tests Playwright
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx playwright test

# ── Production ───────────────────────────────────────────────

prod-up: ## Lance en mode production
	docker compose up -d

prod-down: ## Arrête la production
	docker compose down

prod-build: ## Build l'image de production
	docker compose build
