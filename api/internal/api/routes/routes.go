package routes

import (
	"link-to-social-api/internal/api/controller"

	"github.com/gin-gonic/gin"
)

func ApplyRoutes(c *controller.RestApplication, app *gin.Engine) *gin.Engine {
	app = c.ApplyRoutes(app)
	apiv1 := app.Group("/api/v1")

	private := apiv1.Group("", c.GetAuthMiddleWare())
	public := apiv1.Group("")

	pagePrivate := private.Group("pages")
	pagePublic := public.Group("pages")

	linkPrivate := private.Group("links")
	linkPublic := public.Group("links")

	imagesPrivate := private.Group("images")
	imagesPublic := public.Group("images")

	videoPrivate := private.Group("videos")
	videoPublic := public.Group("videos")

	filePrivate := private.Group("files")
	filePublic := private.Group("files")

	// page
	{
		pagePublic.GET("/:id", c.GetPageById)
		pagePublic.GET("/:id/links", c.GetLinksForPage)
		pagePrivate.POST("", c.NewPage)
		pagePrivate.PATCH("/:id", c.IsPageForAccount, c.UpdatePage)
		pagePrivate.PATCH("/:id/_make_main", c.IsPageForAccount, c.MakePageMain)
		pagePrivate.DELETE("/:id", c.IsPageForAccount, c.DeletePage)

	}

	// links
	{
		linkPublic.GET("/:id", c.GetLinkById)
		linkPrivate.POST("", c.NewLink)
		linkPrivate.PATCH("/:id", c.IsLinkForAccount, c.UpdateLink)
		linkPrivate.DELETE("/:id", c.IsLinkForAccount, c.DeleteLink)
	}

	account := apiv1.Group("accounts")
	// account
	{
		account.GET("/:id/pages/_mainpage", c.GetMainPage)
	}

	// media

	{
		imagesPublic.GET("/_paginated", c.Images.GetAllMedias)
		videoPublic.GET("/_paginated", c.Videos.GetAllMedias)
		imagesPublic.GET("", c.Images.GetMediaByIds)
		videoPublic.GET("", c.Videos.GetMediaByIds)
		filePublic.GET("", c.Files.GetMediaByIds)

		imagesPrivate.POST("", c.Images.GenerateS3Upload)
		videoPrivate.POST("", c.Videos.GenerateS3Upload)
		filePrivate.POST("", c.Files.GenerateS3Upload)

		imagesPrivate.DELETE("", c.IsImageForAccount, c.Images.BulkDeleteMedias)
		videoPrivate.DELETE("", c.IsVideoForAccount, c.Videos.BulkDeleteMedias)
		filePrivate.DELETE("", c.IsFileForAccount, c.Files.BulkDeleteMedias)

	}

	return app
}
