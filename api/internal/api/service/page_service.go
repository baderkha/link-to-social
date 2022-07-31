package service

import (
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo"

	"github.com/baderkha/library/pkg/rql"
	"github.com/pkg/errors"
)

const (
	PageServiceErrorPrefix = "Page Service :"
)

var (
	ErrNotFoundMainPage       = errors.Wrap(errors.New("Could not find page"), PageServiceErrorPrefix)
	ErrorCouldNotTransactPage = errors.Wrap(errorCouldNotTransact, PageServiceErrorPrefix)
)

type Page struct {
	repo repo.IPage
}

func (p *Page) GetMainPage(accountID string) (*model.Page, error) {
	sort, _ := rql.SortExpressionFromUserInput("updated_at::DESC")
	res, err := p.repo.GetWithFilterExpression(
		&rql.FilterExpression{
			BinaryOperation: "AND",
			Properties: []*rql.FilterExpression{
				{
					Column: "account_id",
					Op:     "eq",
					Value:  accountID,
				},
				{
					Column: "is_main_page",
					Op:     "eq",
					Value:  "1",
				},
				{
					Column: "is_viewable",
					Op:     "eq",
					Value:  "1",
				},
			},
		},
		sort,
	)
	if err != nil {
		return nil, errorCouldNotTransact
	} else if len(res) == 0 {

	}
}
func (p *Page) GetPageByID(pageId string) (*model.Page, error)     {}
func (p *Page) MakePageMain(page *model.Page) (*model.Page, error) {}
func (p *Page) NewPage(page *model.Page) (*model.Page, error)      {}
func (p *Page) UpdatePage(page *model.Page) (*model.Page, error)   {}
func (p *Page) DeletePage(pageID string) error                     {}
