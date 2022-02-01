package models

// EASIAction represents an action taken by an EASi user on a system intake
type EASIAction struct {
	ActionType string `json:"actionType"`
	ActorEUA   string `json:"actorEUA"`
	Feedback   string `json:"feedback"`
	IntakeID   string `json:"intakeId"`
}
