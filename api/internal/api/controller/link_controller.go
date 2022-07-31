package controller

import (
	"errors"
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo"
	"net/http"

	"github.com/baderkha/library/pkg/conditional"
	"github.com/baderkha/library/pkg/rql"
	"github.com/gin-gonic/gin"
)

type Link struct {
	repo repo.ILink
}

func (l *Link) GetLinksForPage(ctx *gin.Context) {
	pageId := conditional.Ternary(ctx.Param("id") == "", ctx.Param("id"), ctx.Query("page_id"))
	if pageId == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(errors.New("expected an id in the route or a page_id query parameter")))
		return
	}
	links, err := l.repo.GetWithFilterExpression(
		&rql.FilterExpression{
			Column:          "page_id",
			BinaryOperation: "and",
			Op:              "eq",
			Value:           pageId,
		},
		nil,
	)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, NewResponse(links))
}

func (l *Link) GetLinkById(ctx *gin.Context) {
	id := ctx.Param("id")
	link, err := l.repo.GetById(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, NewResponse(link))
}

func (l *Link) NewLink(ctx *gin.Context) {
	var link model.Link
	err := ctx.ShouldBindJSON(&link)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(err))
		return
	}
	link.New()

	err = l.repo.Create(&link)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusCreated, NewResponse(link))
}

func (l *Link) UpdateLink(ctx *gin.Context) {
	id := ctx.Param("id")
	if !l.repo.IsForAccountID(id, GetAccountId(ctx)) {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(errorResourceNotForUser))
		return
	}
	var link model.Link
	err := ctx.ShouldBindJSON(&link)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(err))
		return
	}
	link.ID = id
	err = l.repo.Create(&link)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, NewResponse(link))
}

func (l *Link) DeleteLink(ctx *gin.Context) {
	id := ctx.Param("id")
	if !l.repo.IsForAccountID(id, GetAccountId(ctx)) {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(errorResourceNotForUser))
		return
	}
	err := l.repo.DeleteById(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, "DELETED "+id)
}
