package sqlqueries

import _ "embed"

// getBusinessCaseByIntakeIDSQL holds the SQL command to get linked Business Case by System Intake ID
//
//go:embed SQL/system_intake_business_case/get_by_intake_ID.sql
var getBusinessCaseByIntakeIDSQL string

// getBusinessCaseByIntakeIDsSQL holds the SQL command to get linked Business Case by System Intake ID via dataloader
//
//go:embed SQL/system_intake_business_case/get_by_intake_IDs.sql
var getBusinessCaseByIntakeIDsSQL string

// getLifecycleCostsByBusinessCaseID holds the SQL command to get linked lifecycle cost lines by biz case ID
//
//go:embed SQL/system_intake_business_case/get_lifecycle_costs_by_biz_case_ID.sql
var getLifecycleCostsByBusinessCaseID string

// getLifecycleCostsByBusinessCaseIDs holds the SQL command to get linked lifecycle cost lines by biz case ID
//
//go:embed SQL/system_intake_business_case/get_lifecycle_costs_by_biz_case_IDs.sql
var getLifecycleCostsByBusinessCaseIDs string

// SystemIntakeBusinessCase holds all relevant SQL scripts for System Intake Business Case
var SystemIntakeBusinessCase = systemIntakeBusinessCasecripts{
	GetBusinessCaseByIntakeID:                  getBusinessCaseByIntakeIDSQL,
	GetBusinessCaseByIntakeIDs:                 getBusinessCaseByIntakeIDsSQL,
	GetEstimatedLifecycleCostLinesByBizCaseID:  getLifecycleCostsByBusinessCaseID,
	GetEstimatedLifecycleCostLinesByBizCaseIDs: getLifecycleCostsByBusinessCaseIDs,
}

type systemIntakeBusinessCasecripts struct {
	GetBusinessCaseByIntakeID                  string
	GetBusinessCaseByIntakeIDs                 string
	GetEstimatedLifecycleCostLinesByBizCaseID  string
	GetEstimatedLifecycleCostLinesByBizCaseIDs string
}
