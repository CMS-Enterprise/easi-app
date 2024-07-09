package sqlqueries

import _ "embed"

// relatedIntakesByIntakeIDsSQL holds the SQL command to get linked System Intakes by System Intake ID via dataloader
//
//go:embed SQL/related_requests/related_intakes_by_intake_ids.sql
var relatedIntakesByIntakeIDsSQL string

// relatedIntakesByTRBRequestIDsSQL holds the SQL command to get linked System Intakes by TRB Request ID via dataloader
//
//go:embed SQL/related_requests/related_intakes_by_trb_request_ids.sql
var relatedIntakesByTRBRequestIDsSQL string

// relatedTRBRequestsByIntakeIDsSQL holds the SQL command to get linked TRB Requests by System Intake ID via dataloader
//
//go:embed SQL/related_requests/related_trb_requests_by_intake_ids.sql
var relatedTRBRequestsByIntakeIDsSQL string

// relatedTRBRequestsByTRBRequestIDsSQL holds the SQL command to get linked TRB Requests by TRB Request ID via dataloader
//
//go:embed SQL/related_requests/related_trb_requests_by_trb_request_ids.sql
var relatedTRBRequestsByTRBRequestIDsSQL string

// RelatedRequests holds all relevant SQL scripts for getting related TRB Requests and System Intakes
var RelatedRequests = relatedRequests{
	IntakesByIntakeIDs:         relatedIntakesByIntakeIDsSQL,
	IntakesByTRBRequestIDs:     relatedIntakesByTRBRequestIDsSQL,
	TRBRequestsByIntakeIDs:     relatedTRBRequestsByIntakeIDsSQL,
	TRBRequestsByTRBRequestIDs: relatedTRBRequestsByTRBRequestIDsSQL,
}

type relatedRequests struct {
	IntakesByIntakeIDs         string
	IntakesByTRBRequestIDs     string
	TRBRequestsByIntakeIDs     string
	TRBRequestsByTRBRequestIDs string
}
