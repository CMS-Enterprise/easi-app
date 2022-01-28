package models

// EASINote represents a note made on an intake in EASi
type EASINote struct {

	// author e u a
	// Required: true
	AuthorEUA *string `json:"authorEUA"`

	// content
	// Required: true
	Content *string `json:"content"`

	// intake Id
	// Required: true
	IntakeID *string `json:"intakeId"`
}
