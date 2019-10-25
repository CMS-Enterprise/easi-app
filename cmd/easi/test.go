package main

import (
	"github.com/spf13/cobra"

	"github.com/cmsgov/easi-app/cmd/easi/test"
)

var testCmd = &cobra.Command{
	Use:   "test",
	Short: "Test the EASi application",
	Long:  `Test the EASi application`,
	Run: func(cmd *cobra.Command, args []string) {
		if All {
			test.All()
		} else if Server {
			test.Server()
		} else {
			test.All()
		}
	},
}

var All bool
var Server bool

func init() {
	testCmd.Flags().BoolVarP(&All, "all", "a", false, "Run all tests")
	testCmd.Flags().BoolVarP(&Server, "server", "s", false, "Run server tests")
}
