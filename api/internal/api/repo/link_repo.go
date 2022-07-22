package repo

import (
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo/mysql"

	"github.com/baderkha/library/pkg/store/repository"
)

var (
	_ ILink = &mysql.LinkMYSQL{}
)

// ILink : link repository
type ILink interface {
	repository.ICrud[model.Link]
}
