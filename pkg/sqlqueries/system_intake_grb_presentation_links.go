package sqlqueries

var deleteSystemIntakeGRBPresentationLinksSQL string

var SystemIntakeGRBPresentationLinks = systemIntakeGRBPresentationLinksScripts{
	Delete: deleteSystemIntakeGRBPresentationLinksSQL,
}

type systemIntakeGRBPresentationLinksScripts struct {
	Delete string
}
