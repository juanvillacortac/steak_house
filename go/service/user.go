package service

import (
	"fmt"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Username       string
	HashedPassword string
	Role           string
}

type UserClaims struct {
	jwt.StandardClaims
	Username string `json:"username"`
	Role     string `json:"role"`
}

func (u *UserClaims) SetClaims(claims jwt.Claims) {
	u.StandardClaims = claims.(jwt.StandardClaims)
}

func NewUser(username string, password string, role string) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("cannot hash password: %w", err)
	}

	user := &User{
		Username:       username,
		HashedPassword: string(hashedPassword),
		Role:           role,
	}

	return user, nil
}

func (user *User) IsCorrectPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(password))
	return err == nil
}
func (user *User) Clone() *User {
	return &User{
		Username:       user.Username,
		HashedPassword: user.HashedPassword,
		Role:           user.Role,
	}
}
