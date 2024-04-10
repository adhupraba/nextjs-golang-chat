Install migration cli

```bash
brew install golang-migrate
```

To create a migration file

```bash
migrate create -ext sql -dir db/migrations add_users_table
```

> migrateup and migratedown commands are defined in the `Makefile`

To migrate up the changes

```bash
make migrateup
```

To migrate down the changes

```bash
make migratedown
```

# Build for production

````bash
# Build for production

```bash
go build -tags netgo -ldflags '-s -w' -o server ./cmd/main.go
````
