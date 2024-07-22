package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/cms-enterprise/easi-app/cmd/easi/test"
)

var testCmd = &cobra.Command{
	Use:   "test",
	Short: "Test the EASi application",
	Long:  `Test the EASi application`,
	Run: func(cmd *cobra.Command, args []string) {
		err := os.Setenv("APP_ENV", "test")
		if err != nil {
			fmt.Printf("Failed to set APP_ENV: %v", err)
		}
		if all {
			test.All()
		} else if serverTest {
			test.Server()
		} else {
			test.All()
		}
	},
}

var all bool
var serverTest bool

func init() {
	testCmd.Flags().BoolVarP(&all, "all", "a", false, "Run all tests")
	testCmd.Flags().BoolVarP(&serverTest, "server", "s", false, "Run server tests")
}
