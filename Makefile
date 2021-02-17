SHELL = /bin/sh

help:  ## Print the help documentation
	@grep -E '^[/a-zA-Z_0-9-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

e2e_test_docker_local: docker_cleanup ## Run Cypress tests locally in docker
	docker-compose -f docker-compose.yml -f docker-compose.cypress_local.yml build --parallel
	docker-compose -f docker-compose.yml -f docker-compose.cypress_local.yml up -d db db_migrate
	docker-compose -f docker-compose.yml -f docker-compose.cypress_local.yml up -d easi easi_client
	docker-compose -f docker-compose.yml -f docker-compose.cypress_local.yml up -d cypress
	docker-compose -f docker-compose.yml -f docker-compose.cypress_local.yml logs -f

docker_cleanup: ## Cleanup resources from previous Docker Compose runs
	docker-compose down --remove-orphans

app_run_docker_local: docker_cleanup ## Run entire app locally in docker
	COMPOSE_HTTP_TIMEOUT=120 docker-compose up --build

db_run_docker_local: docker_cleanup ## Run database and migrations locally in docker
	docker-compose up --build db db_migrate

default: help

.PHONY: help e2e_test_docker_local docker_cleanup app_run_docker_local db_run_docker_local
