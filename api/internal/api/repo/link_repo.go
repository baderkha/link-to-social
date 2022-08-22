package repo

import (
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo/sql"

	"github.com/baderkha/library/pkg/store/repository"
)

var (
	_ ILink = &sql.LinkSQL{}
)

const (
	Link = "link_repository"
)

// ILink : link repository
type ILink interface {
	repository.ICrud[model.Link]
}
