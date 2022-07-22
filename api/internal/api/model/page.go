package model

import "github.com/baderkha/library/pkg/store/entity"

// Page : bio page for a bunch of links
type Page struct {
	entity.BaseOwned
	Title            string `json:"title" db:"title" gorm:"tyoe:varchar(255)"`
	IsMainPage       bool   `json:"-" db:"is_main_page"`
	IsViewable       bool   `json:"-" db:"is_viewable"`
	ProfilePictureId string `json:"profile_picture_id" db:"profile_picture_id"`
}

func (l Page) TableName() string {
	return "page"
}
