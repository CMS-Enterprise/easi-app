package main

import (
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/cms-enterprise/easi-app/pkg/server"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serve the EASi application",
	Long:  `Serve the EASi application`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		server.Serve(config)
	},
}
