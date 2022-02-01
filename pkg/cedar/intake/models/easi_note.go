package models

// EASINote represents a note made on an intake in EASi
type EASINote struct {
	AuthorEUA string `json:"authorEUA"`
	Content   string `json:"content"`
	IntakeID  string `json:"intakeId"`
}
