package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/system_intake_grb_presentation_links/delete.sql
var deleteSystemIntakeGRBPresentationLinksSQL string

var SystemIntakeGRBPresentationLinks = systemIntakeGRBPresentationLinksScripts{
	Delete: deleteSystemIntakeGRBPresentationLinksSQL,
}

type systemIntakeGRBPresentationLinksScripts struct {
	Delete string
}
