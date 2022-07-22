package main

import (
	"link-to-social-api/internal/api"
	"link-to-social-api/internal/pkg/config"
)

func main() {
	api.Init()
	api.Router.Run(":" + config.DefaultEnv().HTTPPort)
}
