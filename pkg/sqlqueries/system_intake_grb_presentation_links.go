package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/system_intake_grb_presentation_links/delete.sql
var deleteSystemIntakeGRBPresentationLinksSQL string

//go:embed SQL/system_intake_grb_presentation_links/get_by_intake_IDs.sql
var getSystemIntakeGRBPresentationLinksByIntakeIDsSQL string

var SystemIntakeGRBPresentationLinks = systemIntakeGRBPresentationLinksScripts{
	Delete:         deleteSystemIntakeGRBPresentationLinksSQL,
	GetByIntakeIDs: getSystemIntakeGRBPresentationLinksByIntakeIDsSQL,
}

type systemIntakeGRBPresentationLinksScripts struct {
	Delete         string
	GetByIntakeIDs string
}
