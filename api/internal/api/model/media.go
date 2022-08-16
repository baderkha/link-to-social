package model

import (
	"fmt"
	"os"

	"github.com/baderkha/library/pkg/store/entity"
)

// Base Model for media types extend this media (we do this so we can have seperate type tables)
type Media struct {
	entity.BaseOwned
	Location      string `json:"location" db:"location"`
	FileMeta      string `json:"file_meta" db:"file_meta"`
	IsPrivate     bool   `json:"is_private" db:"is_private"`
	CategoryLabel string `json:"category_label" db:"category_label"`
}

func (m Media) TableName() string {
	return fmt.Sprintf("%s_media", os.Getenv("MEDIA_TABLE_NAME"))
}
