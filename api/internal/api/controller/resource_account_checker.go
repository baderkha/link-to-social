package controller

import (
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo/mysql"
	"link-to-social-api/internal/pkg/config"
	"net/http"

	"github.com/baderkha/library/pkg/store/repository"
	"github.com/davecgh/go-spew/spew"
	"github.com/gin-gonic/gin"
)

var (
	IsLinkForAccount  = IsResourceForAccount[model.Link](mysql.NewLink(config.GetDB()))
	IsPageForAccount  = IsResourceForAccount[model.Page](mysql.NewPage(config.GetDB()))
	IsImageForAccount = IsResourceForAccount[model.Media](mysql.NewImageMedia(config.GetDB()))
	IsFileForAccount  = IsResourceForAccount[model.Media](mysql.NewFileMedia(config.GetDB()))
	IsVideoForAccount = IsResourceForAccount[model.Media](mysql.NewVideoMedia(config.GetDB()))
)

func IsResourceForAccount[t any](repo repository.ICrud[t]) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		accId := GetAccountId(ctx)
		id := ctx.Param("id")
		if id == "" {
			panic("Expected this to be attached to a uri path with id")
		}
		isForAccID := repo.IsForAccountID(id, accId)
		if isForAccID {
			spew.Dump("here")
			ctx.Next()
			return
		}
		ctx.AbortWithStatusJSON(http.StatusForbidden, NewErrorResponse(errorResourceNotForUser))
	}
}
