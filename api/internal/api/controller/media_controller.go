package controller

import (
	"errors"
	"fmt"
	"link-to-social-api/internal/api/model"
	"link-to-social-api/internal/api/repo"
	"net/http"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	"github.com/baderkha/library/pkg/rql"
	"github.com/baderkha/library/pkg/store/repository"
	"github.com/gin-gonic/gin"
)

var (
	SupportedMediaTypes = map[string][]string{
		"image": {"png", "jpg", "jpeg", "webp", "tiff"}, // photo
		"video": {"mp4", "webm"},                        // video
		"file":  {"pdf", "txt"},                         // regular files
	}
	SupportedMediaTypesFlat       = func(typ string) string { return strings.Join(SupportedMediaTypes[typ], ",") }
	errorUnsupportedFileExtension = func(typ string) error {
		return errors.New("File Type input is not supported , your file types must be either of the following " + SupportedMediaTypesFlat(typ))
	}
)

type UploadInput struct {
	FileExtension string `json:"file_extension" binding:"required"`
	IsPrivate     bool   `json:"is_private"`
}

type UploadOutput struct {
	Media      model.Media `json:"media"`
	UploadLink string      `json:"upload_link"`
}

// Media : media controller
type Media struct {
	mRepo    repo.IMedia
	s3       s3iface.S3API
	s3Prefix string
	bucket   string
	typ      string
	tx       repository.ITransaction
}

func (m *Media) GenerateS3Upload(ctx *gin.Context) {
	var u UploadInput
	var media model.Media
	media.New()
	media.AccountID = GetAccountId(ctx)
	media.IsPrivate = u.IsPrivate
	err := ctx.ShouldBindJSON(&u)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(err))
		return
	} else if !strings.Contains(SupportedMediaTypesFlat(m.typ), u.FileExtension) {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, NewErrorResponse(errorUnsupportedFileExtension(m.typ)))
		return
	}
	tx := m.tx.Begin()
	repo := m.mRepo.WithTransaction(tx)

	media.Location = fmt.Sprintf("%s/%s/%s/%s", m.s3Prefix, m.typ, GetAccountId(ctx), media.ID+"."+u.FileExtension)
	err = repo.Create(&media)
	if err != nil {
		tx.RollBack()
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}

	req, _ := m.s3.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(m.bucket),
		Key:    aws.String(media.Location),
	})

	url, err := req.Presign(15 * time.Minute)
	if err != nil {
		tx.RollBack()
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	tx.Commit()

	ctx.JSON(http.StatusCreated, NewResponse(
		UploadOutput{
			Media:      media,
			UploadLink: url,
		},
	),
	)

}

func (m *Media) BulkDeleteMedias(ctx *gin.Context) {
	ids := ctx.Query("ids")
	if ids == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, "Expected query param ids to have a value")
		return
	}
	idSlice := strings.Split(ids, ",")
	medias, err := m.mRepo.GetWithFilterExpression(&rql.FilterExpression{
		BinaryOperation: "and",
		Properties: []*rql.FilterExpression{
			{
				Column: "id",
				Op:     "in",
				Value:  idSlice,
			},
			{
				Column: "account_id",
				Op:     "eq",
				Value:  GetAccountId(ctx),
			},
		},
	}, nil)

	// lazy way (better way would be just delete what can be deleted gracefully)
	if len(medias) != len(idSlice) {
		ctx.AbortWithStatusJSON(http.StatusForbidden, NewErrorResponse(errorResourceNotForUser))
		return
	}

	// delete transaction

	var s3Keys []*s3.ObjectIdentifier

	for _, m := range medias {
		s3Keys = append(s3Keys, &s3.ObjectIdentifier{
			Key: &m.Location,
		})
	}

	tx := m.tx.Begin()
	rpo := m.mRepo.WithTransaction(tx)
	err = rpo.DeleteByIds(idSlice)
	if err != nil {
		tx.RollBack()
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	_, err = m.s3.DeleteObjects(&s3.DeleteObjectsInput{
		Bucket: &m.bucket,
		Delete: &s3.Delete{
			Objects: s3Keys,
		},
	})
	if err != nil {
		tx.RollBack()
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}
	tx.Commit()

	ctx.JSON(http.StatusOK, "Deleted "+ids)

}

func (m *Media) GetMediaByIds(ctx *gin.Context) {
	ids := ctx.Query("ids")
	if ids == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, "Expected query param ids to have a value")
		return
	}
	idSlice := strings.Split(ids, ",")

	medias, err := m.mRepo.GetWithFilterExpression(&rql.FilterExpression{
		BinaryOperation: "and",
		Properties: []*rql.FilterExpression{
			{
				Column: "id",
				Op:     "in",
				Value:  idSlice,
			},
			{
				Column: "is_private",
				Op:     "ne",
				Value:  "1",
			},
		},
	}, nil)

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, NewErrorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, medias)
}
