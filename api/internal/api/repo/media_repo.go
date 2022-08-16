package repo

import (
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo/mysql"

	"github.com/baderkha/library/pkg/rql"
	"github.com/baderkha/library/pkg/store/repository"
)

var (
	_ IMedia = &mysql.MediaMYSQL{}
)

const (
	Image = "image_repository"
	File  = "file_repository"
	Video = "video_repository"
)

// Media : media queries
type IMedia interface {
	repository.ICrud[model.Media]
	GetAllNonPrivateMediaPaginatedWithFilterExpression(f *rql.FilterExpression,
		p *rql.PaginationExpression,
		s *rql.SortExpression,
	) (*repository.Paginated[model.Media], error)
}
