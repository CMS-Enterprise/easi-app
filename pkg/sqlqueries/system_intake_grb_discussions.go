package sqlqueries

import _ "embed"

//go:embed SQL/system_intake_grb_discussions/insert_internal.sql
var insertSystemIntakeGRBDiscussionSQL string

//go:embed SQL/system_intake_grb_discussions/get_by_id_internal.sql
var getSystemIntakeGRBDiscussionsByIDSQL string

//go:embed SQL/system_intake_grb_discussions/get_by_intake_ids_internal.sql
var getSystemIntakeGRBDiscussionsByIntakeIDsSQL string

// SystemIntakeGRBDiscussion holds all SQL scripts for GRB Discussions
var SystemIntakeGRBDiscussion = systemIntakeGRBDiscussionScripts{
	Create:               insertSystemIntakeGRBDiscussionSQL,
	GetBySystemIntakeIDs: getSystemIntakeGRBDiscussionsByIntakeIDsSQL,
	GetByID:              getSystemIntakeGRBDiscussionsByIDSQL,
}

type systemIntakeGRBDiscussionScripts struct {
	Create               string
	GetByID              string
	GetBySystemIntakeIDs string
}
