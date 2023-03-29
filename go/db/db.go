package db

import (
	"fmt"
	"log"
	"steak_house/go/models"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func InitDb() {
	log.Println("Syncing database")
	db, err := gorm.Open(sqlite.Open("steak_house.db?_pragma=foreign_keys(1)"), &gorm.Config{})
	if err != nil {
		fmt.Println(err.Error())
		panic("failed to connect database")
	}
	db.AutoMigrate(&models.User{})
}
