package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, add a new version for it in pkg/cedar/intake/translation/constants.go

// EASIGrtFeedback represents an item of feedback from the Governance Review team
type EASIGrtFeedback struct {
	Feedback     string `json:"feedback"`
	FeedbackType string `json:"feedbackType"`
	IntakeID     string `json:"intakeId"`
}
