package models

// EASIGrtFeedback represents an item of feedback from the Governance Review team
type EASIGrtFeedback struct {

	// feedback
	// Required: true
	Feedback *string `json:"feedback"`

	// feedback type
	// Required: true
	FeedbackType *string `json:"feedbackType"`

	// intake Id
	// Required: true
	IntakeID *string `json:"intakeId"`
}
