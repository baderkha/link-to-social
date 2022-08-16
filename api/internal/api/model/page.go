package model

import (
	"github.com/baderkha/library/pkg/store/entity"
	"gorm.io/datatypes"
)

// Page : bio page for a bunch of links
type Page struct {
	entity.BaseOwned
	Title            string            `json:"title" db:"title" gorm:"type:varchar(255)" binding:"required"`
	IsMainPage       bool              `json:"-" db:"is_main_page"`
	IsViewable       bool              `json:"-" db:"is_viewable"`
	ProfilePictureId string            `json:"profile_picture_id" db:"profile_picture_id"`
	BackgroundStyle  datatypes.JSONMap `json:"background_style" db:"background_style"`
}

func (l Page) TableName() string {
	return "page"
}
