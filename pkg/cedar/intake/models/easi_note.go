package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, update the version for it in pkg/cedar/intake/translation/constants.go (IntakeInputSchemaEASINoteVersion)

// EASINote represents a note made on an intake in EASi
type EASINote struct {
	AuthorEUA string `json:"authorEUA"`
	Content   string `json:"content"`
	IntakeID  string `json:"intakeId"`
}
