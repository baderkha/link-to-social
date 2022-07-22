package controller

import (
	"errors"
	"link-to-social-api/internal/api/repo/mysql"
	"link-to-social-api/internal/pkg/config"
	"time"

	"github.com/baderkha/library/pkg/controller/gin/auth"
	"github.com/baderkha/library/pkg/store/repository"
	"github.com/gin-gonic/gin"
)

var (
	errorResourceNotForUser = errors.New("One of the resource or resources you're attempting to change is not for you !!")
)

// RestApplication : rest application with all http handlers
type RestApplication struct {
	auth.SessionAuthGinController
	Link
	Page
	Images Media
	Videos Media
	Files  Media
}

type HTTPResponse[t any] struct {
	Data          t      `json:"data"`
	ErrorMessage  string `json:"error_message"`
	ServerMessage string `json:"server_message"`
}

func NewResponse[t any](item t) *HTTPResponse[t] {
	return &HTTPResponse[t]{
		Data:          item,
		ErrorMessage:  "",
		ServerMessage: "ok",
	}
}

func NewErrorResponse(err error) *HTTPResponse[any] {
	var errMessage string
	if err != nil {
		errMessage = err.Error()
	}
	return &HTTPResponse[any]{
		Data:          nil,
		ErrorMessage:  errMessage,
		ServerMessage: "error",
	}
}

func GetAccountId(ctx *gin.Context) string {
	acc, exists := ctx.Get("account_id")
	if !exists {
		panic("should not not have an account")
	}
	return acc.(string)
}

func New() *RestApplication {
	e := config.DefaultEnv()
	dur := time.Duration(e.CookieExpiryDurationMinutes) * time.Minute
	return &RestApplication{
		SessionAuthGinController: *auth.NewGinSessionAuthGorm(
			config.GetDB(),
			"/api/v1/accounts",
			"LINK_TO_SOCIALS_LOGIN",
			dur,
		),
		Link: Link{
			repo: mysql.NewLink(config.GetDB()),
		},
		Page: Page{
			repo: mysql.NewPage(config.GetDB()),
		},
		Images: Media{
			mRepo:    mysql.NewImageMedia(config.GetDB()),
			s3:       config.GetS3(),
			s3Prefix: "/assets",
			bucket:   e.S3Bucket,
			typ:      "image",
			tx: &repository.GormTransaction{
				DB: config.GetDB(),
			},
		},
		Videos: Media{
			mRepo:    mysql.NewVideoMedia(config.GetDB()),
			s3:       config.GetS3(),
			s3Prefix: "/assets",
			bucket:   e.S3Bucket,
			typ:      "video",
			tx: &repository.GormTransaction{
				DB: config.GetDB(),
			},
		},
		Files: Media{
			mRepo:    mysql.NewFileMedia(config.GetDB()),
			s3:       config.GetS3(),
			s3Prefix: "/assets",
			bucket:   e.S3Bucket,
			typ:      "files",
			tx: &repository.GormTransaction{
				DB: config.GetDB(),
			},
		},
	}
}
