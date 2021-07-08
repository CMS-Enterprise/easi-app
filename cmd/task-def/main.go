package main

import (
	"fmt"
	"html/template"
	"log"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

type taskDef struct {
	Environment string
	Region      string
}

var rootCmd = &cobra.Command{
	Use: "create-task-definition-from-template",
	Run: func(cmd *cobra.Command, args []string) {
		settings := taskDef{
			Environment: viper.GetString("environment"),
			Region:      viper.GetString("region"),
		}

		inputFile := viper.GetString("template")
		parsedTemplate, err := template.ParseFiles(inputFile)
		if err != nil {
			log.Fatal(err)
		}

		err = parsedTemplate.Execute(os.Stdout, settings)
		if err != nil {
			log.Fatal(err)
		}
	},
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	viper.AutomaticEnv()
	rootCmd.Flags().StringP("environment", "e", "", "which environment is this for")
	rootCmd.Flags().StringP("template", "t", "", "which template to parse")
	rootCmd.Flags().StringP("region", "r", "us-west-2", "which region to use")
	if err := viper.BindPFlags(rootCmd.Flags()); err != nil {
		log.Fatal(err)
	}
}
