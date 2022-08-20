package sql

import (
	"link-to-social-api/internal/api/model"

	"github.com/baderkha/library/pkg/rql"
	"github.com/baderkha/library/pkg/store/repository"
	"gorm.io/gorm"
)

type GormableEntity interface {
	TableName() string
}

// LinkMYSQL : link mysql implementation
type LinkSQL struct {
	repository.CrudGorm[model.Link]
}

func NewGorm[t GormableEntity](db *gorm.DB) repository.CrudGorm[t] {
	var mod t
	return repository.CrudGorm[t]{
		DB:         db,
		Table:      mod.TableName(),
		PrimaryKey: "id",
		Parser:     rql.SQLBaseFilterParser{},
		Sorter:     &rql.SortParserSQL{},
	}
}

func NewLink(db *gorm.DB) *LinkSQL {
	return &LinkSQL{
		CrudGorm: NewGorm[model.Link](db),
	}
}
