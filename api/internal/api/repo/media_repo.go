package repo

import (
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo/mysql"

	"github.com/baderkha/library/pkg/store/repository"
)

var (
	_ IMedia = &mysql.MediaMYSQL{}
)

// Media : media queries
type IMedia interface {
	repository.ICrud[model.Media]
}
