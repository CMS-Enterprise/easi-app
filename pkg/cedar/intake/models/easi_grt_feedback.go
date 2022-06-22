package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, add a new version for it in pkg/cedar/intake/translation/constants.go

// EASIGrtFeedback represents an item of feedback from the Governance Review team
type EASIGrtFeedback struct {
	FeedbackID   string `json:"feedbackId" jsonschema:"description=Unique UUID of this item of feedback,example=fa62c23b-c16f-497b-9bb6-c42166e82b93"`
	Feedback     string `json:"feedback"`
	FeedbackType string `json:"feedbackType"`
	IntakeID     string `json:"intakeId"`
}
