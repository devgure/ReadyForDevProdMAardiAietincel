
### `Makefile`
.PHONY: help install dev prod build test clean deploy backup restore

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

help:
	@echo "${GREEN}Etincel - Production Commands${NC}"
	@echo "=============================="
	@echo "${YELLOW}Setup:${NC}"
	@echo "  make install       - Install all dependencies"
	@echo "  make setup-env     - Copy .env.example to .env"
	@echo ""
	@echo "${YELLOW}Development:${NC}"
	@echo "  make dev           - Start development environment"
	@echo "  make dev-services  - Start only backend services"
	@echo "  make dev-frontend  - Start only frontend apps"
	@echo ""
	@echo "${YELLOW}Production:${NC}"
	@echo "  make prod          - Start production environment"
	@echo "  make build         - Build all Docker images"
	@echo "  make deploy        - Deploy to production server"
	@echo ""
	@echo "${YELLOW}Database:${NC}"
	@echo "  make migrate       - Run database migrations"
	@echo "  make migrate-all   - Migrate all services"
	@echo "  make seed          - Seed database with test data"
	@echo "  make backup        - Backup database"
	@echo "  make restore       - Restore database from backup"
	@echo ""
	@echo "${YELLOW}Testing:${NC}"
	@echo "  make test          - Run all tests"
	@echo "  make test-unit     - Run unit tests"
	@echo "  make test-integration - Run integration tests"
	@echo "  make test-e2e      - Run E2E tests"
	@echo ""
	@echo "${YELLOW}Maintenance:${NC}"
	@echo "  make logs          - View all service logs"
	@echo "  make logs-service  - View specific service logs (make logs-service SERVICE=auth-service)"
	@echo "  make status        - Check service status"
	@echo "  make health        - Run health checks"
	@echo "  make restart       - Restart all services"
	@echo "  make clean         - Clean all containers and volumes"
	@echo "  make prune         - Remove all unused Docker resources"

# Setup
setup-env:
	@echo "${GREEN}Setting up environment...${NC}"
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "${GREEN}✓ Created .env file${NC}"; \
		echo "${YELLOW}⚠ Please edit .env with your credentials${NC}"; \
	else \
		echo "${YELLOW}⚠ .env already exists${NC}"; \
	fi

install: setup-env
	@echo "${GREEN}Installing all dependencies...${NC}"
	npm install
	@echo "${GREEN}Installing auth-service...${NC}"
	cd services/auth-service && npm install && npx prisma generate
	@echo "${GREEN}Installing profile-service...${NC}"
	cd services/profile-service && npm install && npx prisma generate
	@echo "${GREEN}Installing match-service...${NC}"
	cd services/match-service && npm install && npx prisma generate
	@echo "${GREEN}Installing chat-service...${NC}"
	cd services/chat-service && npm install && npx prisma generate
	@echo "${GREEN}Installing payment-service...${NC}"
	cd services/payment-service && npm install && npx prisma generate
	@echo "${GREEN}Installing notification-service...${NC}"
	cd services/notification-service && npm install
	@echo "${GREEN}Installing media-service...${NC}"
	cd services/media-service && npm install
	@echo "${GREEN}Installing analytics-service...${NC}"
	cd services/analytics-service && npm install && npx prisma generate
	@echo "${GREEN}Installing blockchain-service...${NC}"
	cd services/blockchain-service && npm install
	@echo "${GREEN}Installing webrtc-service...${NC}"
	cd services/webrtc-service && npm install
	@echo "${GREEN}Installing location-service (Go)...${NC}"
	cd services/location-service && go mod download
	@echo "${GREEN}Installing ai-service (Python)...${NC}"
	cd services/ai-service && pip install -r requirements.txt
	@echo "${GREEN}Installing mobile-native...${NC}"
	cd client/mobile-native && npm install
	@echo "${GREEN}Installing mobile-web...${NC}"
	cd client/mobile-web && npm install
	@echo "${GREEN}Installing desktop-web...${NC}"
	cd client/desktop-web && npm install
	@echo "${GREEN}Installing admin-dashboard...${NC}"
	cd admin-dashboard && npm install
	@echo "${GREEN}✓ All dependencies installed!${NC}"

# Development
dev:
	@echo "${GREEN}Starting development environment...${NC}"
	docker-compose -f docker-compose.dev.yml up --build

dev-services:
	@echo "${GREEN}Starting backend services...${NC}"
	docker-compose -f docker-compose.dev.yml up mongodb redis elasticsearch minio \
		auth-service profile-service match-service chat-service payment-service \
		location-service ai-service blockchain-service notification-service \
		media-service analytics-service webrtc-service

dev-frontend:
	@echo "${GREEN}Starting frontend apps...${NC}"
	@echo "${YELLOW}Mobile Web: http://localhost:5173${NC}"
	@echo "${YELLOW}Desktop Web: http://localhost:3000${NC}"
	@echo "${YELLOW}Admin Dashboard: http://localhost:3100${NC}"

# Production
prod:
	@echo "${GREEN}Starting production environment...${NC}"
	docker-compose up -d --build
	@echo "${GREEN}✓ Services started${NC}"
	@echo "${YELLOW}Waiting for services to be healthy...${NC}"
	sleep 30
	@make health

build:
	@echo "${GREEN}Building all Docker images...${NC}"
	docker-compose build
	@echo "${GREEN}✓ Build complete${NC}"

deploy:
	@echo "${GREEN}Deploying to production...${NC}"
	bash scripts/deploy.sh

# Database
migrate:
	@echo "${GREEN}Running database migrations...${NC}"
	docker-compose run --rm auth-service npx prisma migrate deploy
	@echo "${GREEN}✓ Migrations complete${NC}"

migrate-all:
	@echo "${GREEN}Running migrations for all services...${NC}"
	docker-compose run --rm auth-service npx prisma migrate deploy
	docker-compose run --rm profile-service npx prisma migrate deploy
	docker-compose run --rm match-service npx prisma migrate deploy
	docker-compose run --rm chat-service npx prisma migrate deploy
	docker-compose run --rm payment-service npx prisma migrate deploy
	docker-compose run --rm analytics-service npx prisma migrate deploy
	@echo "${GREEN}✓ All migrations complete${NC}"

seed:
	@echo "${GREEN}Seeding database...${NC}"
	docker-compose run --rm auth-service npm run seed
	@echo "${GREEN}✓ Database seeded${NC}"

backup:
	@echo "${GREEN}Creating backup...${NC}"
	bash scripts/backup.sh

restore:
	@if [ -z "$(FILE)" ]; then \
		echo "${RED}Error: Please specify backup file${NC}"; \
		echo "Usage: make restore FILE=backup_20240101.tar.gz"; \
		exit 1; \
	fi
	@echo "${GREEN}Restoring from $(FILE)...${NC}"
	bash scripts/restore.sh $(FILE)

# Testing
test:
	@echo "${GREEN}Running all tests...${NC}"
	npm run test

test-unit:
	@echo "${GREEN}Running unit tests...${NC}"
	npm run test:unit

test-integration:
	@echo "${GREEN}Running integration tests...${NC}"
	npm run test:integration

test-e2e:
	@echo "${GREEN}Running E2E tests...${NC}"
	npm run test:e2e

# Maintenance
logs:
	@echo "${GREEN}Showing logs for all services...${NC}"
	docker-compose logs -f --tail=100

logs-service:
	@if [ -z "$(SERVICE)" ]; then \
		echo "${RED}Error: Please specify service${NC}"; \
		echo "Usage: make logs-service SERVICE=auth-service"; \
		exit 1; \
	fi
	@echo "${GREEN}Showing logs for $(SERVICE)...${NC}"
	docker-compose logs -f --tail=100 $(SERVICE)

status:
	@echo "${GREEN}Service Status:${NC}"
	@docker-compose ps

health:
	@echo "${GREEN}Running health checks...${NC}"
	bash scripts/health-check.sh

restart:
	@echo "${GREEN}Restarting all services...${NC}"
	docker-compose restart
	@echo "${GREEN}✓ Services restarted${NC}"

restart-service:
	@if [ -z "$(SERVICE)" ]; then \
		echo "${RED}Error: Please specify service${NC}"; \
		echo "Usage: make restart-service SERVICE=auth-service"; \
		exit 1; \
	fi
	@echo "${GREEN}Restarting $(SERVICE)...${NC}"
	docker-compose restart $(SERVICE)

stop:
	@echo "${YELLOW}Stopping all services...${NC}"
	docker-compose stop

down:
	@echo "${YELLOW}Stopping and removing containers...${NC}"
	docker-compose down

clean:
	@echo "${RED}Cleaning all containers and volumes...${NC}"
	@read -p "Are you sure? This will delete all data. (y/N) " confirm; \
	if [ "$confirm" = "y" ]; then \
		docker-compose down -v; \
		echo "${GREEN}✓ Cleanup complete${NC}"; \
	else \
		echo "${YELLOW}Cancelled${NC}"; \
	fi

prune:
	@echo "${YELLOW}Removing unused Docker resources...${NC}"
	docker system prune -af
	@echo "${GREEN}✓ Prune complete${NC}"

# Utilities
ps:
	@docker-compose ps

exec:
	@if [ -z "$(SERVICE)" ]; then \
		echo "${RED}Error: Please specify service${NC}"; \
		echo "Usage: make exec SERVICE=auth-service"; \
		exit 1; \
	fi
	@docker-compose exec $(SERVICE) sh

db-shell:
	@echo "${GREEN}Opening MongoDB shell...${NC}"
	docker-compose exec mongodb mongosh -u admin -p $(MONGO_PASSWORD) --authenticationDatabase admin

redis-cli:
	@echo "${GREEN}Opening Redis CLI...${NC}"
	docker-compose exec redis redis-cli -a $(REDIS_PASSWORD)

# Quick commands
up: prod
down: stop
restart: restart