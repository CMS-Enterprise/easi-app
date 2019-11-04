package main

import (
	"github.com/spf13/cobra"

	"github.com/cmsgov/easi-app/pkg/server"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serve the EASi application",
	Long:  `Serve the EASi application`,
	Run: func(cmd *cobra.Command, args []string) {
		server.Serve()
	},
}
