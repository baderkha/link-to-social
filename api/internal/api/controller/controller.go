package controller

import (
	"errors"
	"fmt"
	"link-to-social-api/internal/api/repo/sql"
	"link-to-social-api/internal/pkg/config"
	"net/http"
	"time"

	"github.com/baderkha/library/pkg/controller/gin/auth"
	"github.com/baderkha/library/pkg/controller/gin/auth/sso"
	"github.com/baderkha/library/pkg/email"
	"github.com/baderkha/library/pkg/rql"
	"github.com/baderkha/library/pkg/store/repository"
	"github.com/davecgh/go-spew/spew"
	"github.com/gin-gonic/gin"
)

const (
	maxPaginationSize = 40
)

var (
	errorResourceNotForUser        = errors.New("One of the resource or resources you're attempting to change is not for you !! Or You've already deleted this resource")
	errorExceededMaxPaginationSize = fmt.Errorf("Pagination size cannot exceed %d records per request", maxPaginationSize)
)

// RestApplication : rest application with all http handlers
type RestApplication struct {

	// Auth Controller for Login / Logout
	auth.SessionAuthGinController

	// Regular Controller Block
	Link
	Page
	Images Media
	Videos Media
	Files  Media

	// Is For Account Block // put all the handler functions here
	IsLinkForAccount  gin.HandlerFunc
	IsPageForAccount  gin.HandlerFunc
	IsImageForAccount gin.HandlerFunc
	IsFileForAccount  gin.HandlerFunc
	IsVideoForAccount gin.HandlerFunc
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

func GetExpressions(ctx *gin.Context) (*rql.FilterExpression, *rql.PaginationExpression, *rql.SortExpression, bool) {

	filterString := ctx.Query("filters")
	isFilterBase64 := ctx.Query("filter_is_base64") == "1"
	p := ctx.Query("page")
	s := ctx.Query("size")
	sort := ctx.Query("sort")

	filterExpr, err := rql.FilterExpressionFromUserInput(filterString, isFilterBase64)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(err))
		spew.Dump(err)
		return nil, nil, nil, false
	}

	paginationExpr, err := rql.PaginationExpressionFromUserInput(p, s)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(err))
		return nil, nil, nil, false
	} else if paginationExpr.Size() > maxPaginationSize {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(errorExceededMaxPaginationSize))
		return nil, nil, nil, false
	}

	sortExpr, err := rql.SortExpressionFromUserInput(sort)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(err))
		spew.Dump(err)
		return nil, nil, nil, false
	}

	return filterExpr, paginationExpr, sortExpr, true
}

func New() *RestApplication {
	e := config.DefaultEnv()
	dur := time.Duration(e.CookieExpiryDurationMinutes) * time.Minute

	return &RestApplication{
		SessionAuthGinController: *auth.NewGinSessionAuthGorm(
			&auth.SessionConfig{
				DB:                   config.GetDB(),
				BasePathRoute:        "/api/v1",
				CookieName:           e.CookieName,
				LoginExpiryTime:      dur,
				Domain:               e.Domain,
				PasswordResetURLFull: e.ResetPasswordFrontEndURLPath,
				VerifyEmailURLFull:   e.VerifyEmailBackendURLPath,
				SSOConfig: sso.Config{
					GoogleClientID: e.GoogleClientID,
				},
				PasswordResetLinkDuration: dur,
				Mailer:                    email.NewSendGridSender(e.SendGridAPIToken),
				EmailSender:               e.SendGridEmail,
				EmailSenderUserFriendly:   "Link To Socials",
				ResetPasswordTemplateHTML: config.GetEmailTemplate("reset"),
				VerifyAccountTemplateHTML: config.GetEmailTemplate("verify"),
			},
		),

		Link: Link{
			repo: sql.NewLink(config.GetDB()),
		},
		Page: Page{
			repo: sql.NewPage(config.GetDB()),
		},
		Images: Media{
			mRepo:    sql.NewImageMedia(config.GetDB()),
			s3:       config.GetS3(),
			s3Prefix: "/assets",
			bucket:   e.S3Bucket,
			typ:      "image",
			tx: &repository.GormTransaction{
				DB: config.GetDB(),
			},
		},
		Videos: Media{
			mRepo:    sql.NewVideoMedia(config.GetDB()),
			s3:       config.GetS3(),
			s3Prefix: "/assets",
			bucket:   e.S3Bucket,
			typ:      "video",
			tx: &repository.GormTransaction{
				DB: config.GetDB(),
			},
		},
		Files: Media{
			mRepo:    sql.NewFileMedia(config.GetDB()),
			s3:       config.GetS3(),
			s3Prefix: "/assets",
			bucket:   e.S3Bucket,
			typ:      "files",
			tx: &repository.GormTransaction{
				DB: config.GetDB(),
			},
		},
		IsLinkForAccount:  IsLinkForAccount,
		IsPageForAccount:  IsPageForAccount,
		IsImageForAccount: IsImageForAccount,
		IsFileForAccount:  IsFileForAccount,
		IsVideoForAccount: IsVideoForAccount,
	}
}
