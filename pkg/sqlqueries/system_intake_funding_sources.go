package sqlqueries

import _ "embed"

// getSystemIntakeFundingSourcesBySystemIntakeIDs holds the SQL command to get all linked Funding Sources for multiple System Intakes
//
//go:embed SQL/system_intake_funding_sources/get_all_by_IDs.sql
var getSystemIntakeFundingSourcesBySystemIntakeIDs string

// getSystemIntakeFundingSourcesBySystemIntakeIDs holds the SQL command to get all linked Funding Sources for multiple System Intakes
//
//go:embed SQL/system_intake_funding_sources/get_all_by_ID.sql
var getSystemIntakeFundingSourcesBySystemIntakeID string

// SystemIntakeFundingSources holds all relevant SQL scripts for a System Intake's funding sources
var SystemIntakeFundingSources = systemIntakeFundingSourcesScripts{
	GetAllBySystemIntakeIDs: getSystemIntakeFundingSourcesBySystemIntakeIDs,
	GetAllBySystemIntakeID:  getSystemIntakeFundingSourcesBySystemIntakeID,
}

type systemIntakeFundingSourcesScripts struct {
	GetAllBySystemIntakeIDs string
	GetAllBySystemIntakeID  string
}
