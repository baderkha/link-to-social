package mysql

import (
	"link-to-social-api/internal/api/model"
	"os"

	"github.com/baderkha/library/pkg/rql"
	"github.com/baderkha/library/pkg/store/repository"
	"gorm.io/gorm"
)

// MediaMYSQL repository
type MediaMYSQL struct {
	repository.CrudGorm[model.Media]
}

func (m MediaMYSQL) GetAllNonPrivateMediaPaginatedWithFilterExpression(f *rql.FilterExpression, p *rql.PaginationExpression, s *rql.SortExpression) (*repository.Paginated[model.Media], error) {
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
