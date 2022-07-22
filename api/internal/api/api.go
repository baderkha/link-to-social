package api

import (
	"link-to-social-api/internal/api/controller"
	"link-to-social-api/internal/api/routes"
	"link-to-social-api/internal/pkg/config"

	"github.com/gin-gonic/gin"
)

var (
	Router *gin.Engine
)

func Init() {
	config.Init()
	Router = gin.Default()
	c := controller.New()
	routes.ApplyRoutes(c, Router)
}
