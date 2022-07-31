package controller

import (
	"link-to-social-api/internal/api/service"
	"net/http"

	"github.com/baderkha/library/pkg/conditional"
	"github.com/gin-gonic/gin"
)

const (
	defaultExitHTTPErrorStatus = http.StatusInternalServerError
)

var (
	// serviceToClientStatusMap : a cheap rip off of the spring error handler
	serviceToClientStatusMap = map[error]int{
		// BAD REQUEST BLOCK
		// NOT FOUND BLOCK
		service.ErrNotFoundMainPage: http.StatusNotFound,
		// UNAUTHORIZED BLOCK
		// FOREBIDDEN BLOCK
		// INTERNAL SERVER ERROR BLOCK
		service.ErrorCouldNotTransactPage: http.StatusInternalServerError,
	}
)

func StatusCodeForError(err error) int {
	var status int
	status = serviceToClientStatusMap[err]
	return conditional.Ternary(status == 0, defaultExitHTTPErrorStatus, status)
}

func GinErrorResponse(ctx *gin.Context, err error) {
	httpRes := NewErrorResponse(err)
	ctx.JSON(StatusCodeForError(err), httpRes)
	ctx.Abort()
}
