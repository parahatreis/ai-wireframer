.PHONY: help up down logs lint format check

help:
	@echo "Available commands:"
	@echo "  make up       - Start the service"
	@echo "  make down     - Stop the service"
	@echo "  make logs     - View logs"
	@echo "  make lint     - Check code with ruff"
	@echo "  make format   - Format code with ruff"
	@echo "  make check    - Lint and format check"

up:
	docker-compose up

down:
	docker-compose down

logs:
	docker-compose logs -f ai

lint:
	docker-compose exec ai ruff check app/

format:
	docker-compose exec ai ruff format app/

check:
	docker-compose exec ai ruff check --fix app/ && docker-compose exec ai ruff format app/

