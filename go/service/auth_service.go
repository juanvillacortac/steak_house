package service

import (
	"context"
	"steak_house/go/jwt"
	"steak_house/go/proto/auth"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AuthService struct {
	auth.UnimplementedAuthServiceServer
	userStore  UserStore
	jwtManager *jwt.JWTManager
}

func RegisterAuthService(server *grpc.Server, jwtManager *jwt.JWTManager) {
	service := &AuthService{
		userStore:  NewInMemoryUserStore(),
		jwtManager: jwtManager,
	}
	auth.RegisterAuthServiceServer(server, service)
}

func (s *AuthService) Login(ctx context.Context, req *auth.LoginRequest) (*auth.LoginResponse, error) {
	user, err := s.userStore.Find(req.GetUsername())
	if err != nil {
		return nil, status.Errorf(codes.Internal, "cannot find user: %v", err)
	}

	if user == nil || !user.IsCorrectPassword(req.GetPassword()) {
		return nil, status.Errorf(codes.NotFound, "incorrect username/password")
	}

	data := &UserClaims{
		Username: user.Username,
		Role:     user.Role,
	}
	token, err := s.jwtManager.Generate(data)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "cannot generate access token")
	}

	res := &auth.LoginResponse{AccessToken: token}
	return res, nil
}
