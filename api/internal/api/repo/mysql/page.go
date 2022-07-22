package mysql

import (
	"link-to-social-api/internal/api/model"

	"github.com/baderkha/library/pkg/store/repository"
	"gorm.io/gorm"
)

// PageMYSQL repository
type PageMYSQL struct {
	repository.CrudGorm[model.Page]
}

func NewPage(db *gorm.DB) *PageMYSQL {
	return &PageMYSQL{
		CrudGorm: NewGorm[model.Page](db),
	}
}
