package main

import (
	"steak_house/go/server"
	_ "steak_house/migrations"
)

func main() {
	server.StartServer(true, true)
}
