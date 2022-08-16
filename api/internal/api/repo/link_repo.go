package repo

import (
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo/mysql"

	"github.com/baderkha/library/pkg/store/repository"
)

var (
	_ ILink = &mysql.LinkMYSQL{}
)

const (
	Link = "link_repository"
)

// ILink : link repository
type ILink interface {
	repository.ICrud[model.Link]
}
