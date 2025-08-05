package main

import (
	_ "embed"
	"fmt"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

//go:embed sql/get_system_intake_contact_names.sql
var getAllNamesSQL string

var queryContactCommonNameCmd = &cobra.Command{
	Use:   "contact common name",
	Short: "Query unique common names in the database and output to json file",
	Long:  "Query unique common names in the database and output to json file",
	Run: func(cmd *cobra.Command, args []string) {

		QuerySystemIntakeContactCommonNamesAndExportToJSON()

	},
}

func (u *Uploader) QuerySystemIntakeContactCommonNames() ([]string, error) {
	names := []string{}
	err := u.DB.Select(&names, getAllNamesSQL)

	if err != nil {
		return nil, fmt.Errorf(" unable to query common names %w", err)

	}

	return names, nil
}

func QuerySystemIntakeContactCommonNamesAndExportToJSON() {
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)

	fmt.Println("Querying common names for system intake contacts...")
	commonNames, err := uploader.QuerySystemIntakeContactCommonNames()
	if err != nil {
		fmt.Printf("Error querying common names: %v\n", err)
		return
	}
	writeObjectToJSONFile(commonNames, contactCommonNamesPath)

	// fmt.Printf("Common names for system intake contacts: %v\n", commonNames)
}
