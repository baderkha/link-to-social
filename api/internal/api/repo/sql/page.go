package sql

import (
	"link-to-social-api/internal/api/model"

	"github.com/baderkha/library/pkg/store/repository"
	"gorm.io/gorm"
)

// PageMYSQL repository
type PageSQL struct {
	repository.CrudGorm[model.Page]
}

func NewPage(db *gorm.DB) *PageSQL {
	return &PageSQL{
		CrudGorm: NewGorm[model.Page](db),
	}
}
