package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/system_intake_grb_presentation_links/delete.sql
var deleteSystemIntakeGRBPresentationLinksSQL string

//go:embed SQL/system_intake_grb_presentation_links/get_by_intake_IDs.sql
var getSystemIntakeGRBPresentationLinksByIntakeIDsSQL string

//go:embed SQL/system_intake_grb_presentation_links/upsert.sql
var upsertSystemIntakeGRBPresentationLinks string

var SystemIntakeGRBPresentationLinks = systemIntakeGRBPresentationLinksScripts{
	Delete:         deleteSystemIntakeGRBPresentationLinksSQL,
	GetByIntakeIDs: getSystemIntakeGRBPresentationLinksByIntakeIDsSQL,
	Upsert:         upsertSystemIntakeGRBPresentationLinks,
}

type systemIntakeGRBPresentationLinksScripts struct {
	Delete         string
	GetByIntakeIDs string
	Upsert         string
}
