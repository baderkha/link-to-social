package mysql

import (
	"link-to-social-api/internal/api/model"

	"github.com/baderkha/library/pkg/store/repository"
	"gorm.io/gorm"
)

// MediaMYSQL repository
type MediaMYSQL struct {
	repository.CrudGorm[model.Media]
}

func NewMedia(db *gorm.DB) *MediaMYSQL {
	return &MediaMYSQL{
		CrudGorm: NewGorm[model.Media](db),
	}
}
