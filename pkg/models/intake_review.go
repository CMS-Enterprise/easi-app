package models

import "github.com/google/uuid"

// IntakeReviewDecision represents the decision on an intake review
type IntakeReviewDecision string

const (
	// IntakeReviewDecisionISSUEID captures enum value "ISSUE_ID"
	IntakeReviewDecisionISSUEID IntakeReviewDecision = "ISSUE_ID"
	// IntakeReviewDecisionREVIEWNEEDED captures enum value "REVIEW_PROCESS_NEEDED"
	IntakeReviewDecisionREVIEWNEEDED IntakeReviewDecision = "REVIEW_PROCESS_NEEDED"
	// IntakeReviewDecisionGOVERNANCENOTNEEDED captures enum value "GOVERNANCE_NOT_NEEDED"
	IntakeReviewDecisionGOVERNANCENOTNEEDED IntakeReviewDecision = "GOVERNANCE_NOT_NEEDED"
)

// IntakeReview models the GRT review form for a system intake
type IntakeReview struct {
	IntakeID  uuid.UUID
	Decision  IntakeReviewDecision
	EmailText string
}
