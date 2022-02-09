package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, add a new version for it in pkg/cedar/intake/translation/schema_versions.go
// and update the associated version in cmd/gen_intake_schema/main.go

// EASINote represents a note made on an intake in EASi
type EASINote struct {
	AuthorEUA string `json:"authorEUA"`
	Content   string `json:"content"`
	IntakeID  string `json:"intakeId"`
}
