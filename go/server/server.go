package server

import (
	"log"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func disableAdminMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if strings.HasPrefix(c.Path(), "/_") {
				return apis.NewForbiddenError("You are not allowed to access this resource", nil)
			}
			return next(c)
		}
	}
}

func StartServer(autoStart bool, disableAdmin bool) {
	app := pocketbase.New()

	if disableAdmin {
		app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
			e.Router.Use(disableAdminMiddleware())

			return nil
		})
	}

	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
		Automigrate: true, // auto creates migration files when making collection changes
	})

	if autoStart {
		app.RootCmd.SetArgs([]string{"serve", "--http", "127.0.0.1:9080"})
	}

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
