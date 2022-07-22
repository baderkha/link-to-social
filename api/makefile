shutdown-db:
	cd docker && docker-compose down
init-db:
	cd docker && docker-compose up -d
run-local:
	ENV_FILE=env.local.json go run scripts/migration/main.go
	ENV_FILE=env.local.json go run cmd/local/api/main.go 