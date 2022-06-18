up:
	docker-compose up
down:
	docker-compose down --remove-orphans
dev:
	docker-compose up -d
	open -a Google\ Chrome http://localhost:8080
restart:
	@make down
	@make up
app:
	docker-compose exec php bin/bash
