package mysql

import (
	"link-to-social-api/internal/api/model"
	"os"

	"github.com/baderkha/library/pkg/store/repository"
	"gorm.io/gorm"
)

// MediaMYSQL repository
type MediaMYSQL struct {
	repository.CrudGorm[model.Media]
}

func NewImageMedia(db *gorm.DB) *MediaMYSQL {
	os.Setenv("MEDIA_TABLE_NAME", "image")
	return &MediaMYSQL{
		CrudGorm: NewGorm[model.Media](db),
	}
}

func NewVideoMedia(db *gorm.DB) *MediaMYSQL {
	os.Setenv("MEDIA_TABLE_NAME", "video")
	return &MediaMYSQL{
		CrudGorm: NewGorm[model.Media](db),
	}
}

func NewFileMedia(db *gorm.DB) *MediaMYSQL {
	os.Setenv("MEDIA_TABLE_NAME", "file")
	return &MediaMYSQL{
		CrudGorm: NewGorm[model.Media](db),
	}
}
