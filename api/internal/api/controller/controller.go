package controller

import (
	"errors"
	"link-to-social-api/internal/pkg/config"
	"time"

	"github.com/baderkha/library/pkg/controller/gin/auth"
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
}

type HTTPResponse[t any] struct {
	Data          t      `json:"data"`
	ErrorMessage  error  `json:"error_message"`
	ServerMessage string `json:"server_message"`
}

func NewResponse[t any](item t) *HTTPResponse[t] {
	return &HTTPResponse[t]{
		Data:          item,
		ErrorMessage:  nil,
		ServerMessage: "ok",
	}
}

func NewErrorResponse(err error) *HTTPResponse[any] {
	return &HTTPResponse[any]{
		Data:          nil,
		ErrorMessage:  err,
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
		Auth: *auth.NewGinSessionAuthGorm(
			config.GetDB(),
			"*.linktosocials.com",
			"LINK_TO_SOCIALS_LOGIN",
			dur,
		),
	}
}
