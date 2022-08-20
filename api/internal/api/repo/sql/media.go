package sql

import (
	"link-to-social-api/internal/api/model"
	"os"

	"github.com/baderkha/library/pkg/rql"
	"github.com/baderkha/library/pkg/store/repository"
	"gorm.io/gorm"
)

// MediaMYSQL repository
type MediaSQL struct {
	repository.CrudGorm[model.Media]
}

func (m MediaSQL) GetAllNonPrivateMediaPaginatedWithFilterExpression(f *rql.FilterExpression, p *rql.PaginationExpression, s *rql.SortExpression) (*repository.Paginated[model.Media], error) {
	return m.CrudGorm.GetWithFilterExpressionPaginated(f, p, s, &rql.FilterExpression{
		BinaryOperation: rql.ANDOperator,
		Properties: []*rql.FilterExpression{
			{
				Column: "is_private",
				Op:     "ne",
				Value:  "1",
			},
		},
	})
}

func NewImageMedia(db *gorm.DB) *MediaSQL {
	os.Setenv("MEDIA_TABLE_NAME", "image")
	return &MediaSQL{
		CrudGorm: NewGorm[model.Media](db),
	}
}

func NewVideoMedia(db *gorm.DB) *MediaSQL {
	os.Setenv("MEDIA_TABLE_NAME", "video")
	return &MediaSQL{
		CrudGorm: NewGorm[model.Media](db),
	}
}

func NewFileMedia(db *gorm.DB) *MediaSQL {
	os.Setenv("MEDIA_TABLE_NAME", "file")
	return &MediaSQL{
		CrudGorm: NewGorm[model.Media](db),
	}
}
