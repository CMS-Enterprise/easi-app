package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "easi",
	Short: "EASi is an application for managing the CMS IT project workflow",
	Long: `EASi (Easy Access to System Information)
			is an application for managing the CMS IT project workflow`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Print("Hello")
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.AddCommand(serveCmd)
}

func main() {
	Execute()
}
