package main

import (
	"fmt"
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/pkg/config"

	"github.com/baderkha/library/pkg/store/entity"
)

func main() {
	config.Init()
	db := config.GetDB()
	fmt.Println("RUNNING DB MIGRATION")

	db.AutoMigrate(&entity.Session{})
	db.Table("accounts").AutoMigrate(&entity.Account{})
	db.AutoMigrate(&model.Link{})
	db.AutoMigrate(&model.Page{})
	db.Table("image_media").AutoMigrate(&model.Media{})
	db.Table("file_media").AutoMigrate(&model.Media{})
	db.Table("video_media").AutoMigrate(&model.Media{})
	db.AutoMigrate(&model.HashVerificationAccount{})
	fmt.Println("COMPLETED DB MIGRATION")
}
