migrateup:
	migrate -path db/migrations -database "postgresql://postgres:postgres@localhost:5432/go_chat_app?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migrations -database "postgresql://postgres:postgres@localhost:5432/go_chat_app?sslmode=disable" -verbose down

.PHONY: migrateup migratedown
