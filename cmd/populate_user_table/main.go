package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var rootCmd = &cobra.Command{
	Use:   "accountUploader",
	Short: "accountUploader is utility for querying and generating user account references",
	Long:  "accountUploader is utility for querying and generating user account references",
}

func init() {
	// rootCmd.AddCommand(serveCmd)
	// rootCmd.AddCommand(testCmd)
}
func execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

// TODO: https://github.com/CMSgov/mint-app/tree/00e01f91fd8e7e624c54c25d3b3f62d0a8a388d4/cmd/backfill is a good reference point
func main() {
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)
	_ = rootCmd //TODO, do we even want to bother with cobra?
	userNames, err := uploader.QueryUsernames()
	if err != nil {
		fmt.Print(err)
	}
	fmt.Print(userNames)

	/*
		Steps
		1. Query the database for all fields where there is
			a. a username (EUAID)  (query is get_all_usernames.sql) --> do the same approach with full names to try and do a match
			b. a FullName of a User
		2. Aggregate Unique records
		3. Query OKTA for all users by unique username
		4. See if there are any matches with username and FullName
		5. Query for users by FullName, see if there is a match, and if there is more than one?
			a. How can we validate full names?
		6. Create user records for each unique user (combine results from username and name)
		7. Create an output in JSON / CSV to show results, and if anyone isn't found (so we can handle them specifically)


	*/

}
