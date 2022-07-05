package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, update the version for it in pkg/cedar/intake/translation/constants.go (IntakeInputSchemaEASIActionVersion)

// EASIAction represents an action taken by an EASi user on a system intake
type EASIAction struct {
	ActionType string `json:"actionType"`
	ActorEUA   string `json:"actorEUA"`
	Feedback   string `json:"feedback"` // Feedback sent to requestor via email
	IntakeID   string `json:"intakeId"`
}
