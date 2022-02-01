package models

// EASIGrtFeedback represents an item of feedback from the Governance Review team
type EASIGrtFeedback struct {
	Feedback     string `json:"feedback"`
	FeedbackType string `json:"feedbackType"`
	IntakeID     string `json:"intakeId"`
}
