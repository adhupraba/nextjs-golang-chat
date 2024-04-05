package main

import (
	"log"

	"server/db"
	"server/internal/router"
	"server/internal/user"
	"server/internal/ws"
)

func main() {
	dbConn, err := db.NewDatabase()

	if err != nil {
		log.Fatalf("could not initialize database connection: %s", err)
	}

	userRepo := user.NewRepository(dbConn.GetDb())
	userSvc := user.NewService(userRepo)
	userHandler := user.NewHandler(userSvc)

	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)

	go hub.Run()

	router.InitRouter(userHandler, wsHandler)
	router.Start("0.0.0.0:8080")
}
