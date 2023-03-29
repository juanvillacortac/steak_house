package server

import (
	// "log"
	// "net"
	// "time"
	//
	// "steak_house/go/db"
	// "steak_house/go/jwt"
	// "steak_house/go/service"
	//
	// "google.golang.org/grpc"
	"log"

	"github.com/pocketbase/pocketbase"
)

func StartServer() {
	app := pocketbase.New()
	app.RootCmd.SetArgs([]string{"serve"})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}

	// db.InitDb()
	//
	// lis, err := net.Listen("tcp", ":3333")
	// if err != nil {
	// 	log.Fatalf("failed to listen: %v", err)
	// }
	//
	// jwtManager := jwt.NewJWTManager("secret", 15*time.Minute)
	// interceptor := service.NewAuthInterceptor(jwtManager, service.AccessibleRoles())
	//
	// server := grpc.NewServer(
	// 	grpc.UnaryInterceptor(interceptor.Unary()),
	// 	grpc.StreamInterceptor(interceptor.Stream()),
	// )
	// service.RegisterAuthService(server, jwtManager)
	// log.Printf("server listening at %v", lis.Addr())
	// if err := server.Serve(lis); err != nil {
	// 	log.Fatalf("failed to serve: %v", err)
	// }
}
