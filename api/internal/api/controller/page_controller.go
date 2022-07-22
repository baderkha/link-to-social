package controller

import (
	"errors"
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo"
	"net/http"

	"github.com/baderkha/library/pkg/rql"
	"github.com/gin-gonic/gin"
)

type Page struct {
	repo repo.IPage
}

func (p *Page) getMainPage(accountID string) (*model.Page, error) {
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
		return nil, err
	} else if len(res) == 0 {
		return nil, errors.New("could not find main page")
	}
	return res[0], nil
}

func (p *Page) GetMainPage(ctx *gin.Context) {
	accountId := ctx.Param("id")
	res, err := p.getMainPage(accountId)
	if err != nil || res == nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, NewResponse(res))
}

func (p *Page) GetPageById(ctx *gin.Context) {
	id := ctx.Param("id")
	page, err := p.repo.GetById(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, page)
}

func (p *Page) MakePageMain(ctx *gin.Context) {
	id := ctx.Param("id")
	if !p.repo.IsForAccountID(id, GetAccountId(ctx)) {
		ctx.AbortWithStatusJSON(http.StatusForbidden, NewErrorResponse(errorResourceNotForUser))
		return
	}

	page, err := p.repo.GetById(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, NewErrorResponse(err))
		return
	}
	page.IsMainPage = true
	err = p.repo.Update(page)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, NewResponse(page))
}

func (p *Page) NewPage(ctx *gin.Context) {
	var page model.Page
	err := ctx.ShouldBindJSON(&page)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(err))
		return
	}
	err = p.repo.Create(&page)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, NewResponse(page))
}

func (p *Page) UpdatePage(ctx *gin.Context) {
	id := ctx.Param("id")
	if !p.repo.IsForAccountID(id, GetAccountId(ctx)) {
		ctx.AbortWithStatusJSON(http.StatusForbidden, NewErrorResponse(errorResourceNotForUser))
		return
	}
	var page model.Page
	err := ctx.ShouldBindJSON(&page)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(err))
		return
	}
	page.ID = id
	err = p.repo.Update(&page)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, NewResponse(page))
}

func (p *Page) DeletePage(ctx *gin.Context) {
	id := ctx.Param("id")
	if !p.repo.IsForAccountID(id, GetAccountId(ctx)) {
		ctx.AbortWithStatusJSON(http.StatusForbidden, NewErrorResponse(errorResourceNotForUser))
		return
	}
	err := p.repo.DeleteById(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, NewResponse("Deleted "+id))
}
