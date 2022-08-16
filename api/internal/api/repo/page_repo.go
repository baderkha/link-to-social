package repo

import (
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo/mysql"

	"github.com/baderkha/library/pkg/store/repository"
)

var (
	_ IPage = &mysql.PageMYSQL{}
)

const (
	Page = "page_repository"
)

// Page : page repository specification
type IPage interface {
	repository.ICrud[model.Page]
}
