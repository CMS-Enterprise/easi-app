package main

// TODO: https://github.com/CMSgov/mint-app/tree/00e01f91fd8e7e624c54c25d3b3f62d0a8a388d4/cmd/backfill is a good reference point
func main() {

	/*
		Steps
		1. Query the database for all fields where there is
			a. a username (EUAID)
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
