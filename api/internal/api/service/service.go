package service

import (
	"errors"
	"link-to-social-api/internal/api/model"
)

var errorCouldNotTransact = errors.New("")

var _ IService = &Service{}

// IService
type IService interface {
	GetMainPage(accountID string) (*model.Page, error)
	GetPageByID(pageId string) (*model.Page, error)
	MakePageMain(page *model.Page) (*model.Page, error)
	NewPage(page *model.Page) (*model.Page, error)
	UpdatePage(page *model.Page) (*model.Page, error)
	DeletePage(pageID string) error
}

type Service struct {
}
