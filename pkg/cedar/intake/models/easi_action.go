package models

// EASIAction represents an action taken by an EASi user on a system intake
type EASIAction struct {
	// action type
	// Required: true
	ActionType *string `json:"actionType"`

	// actor e u a
	// Required: true
	ActorEUA *string `json:"actorEUA"`

	// feedback
	// Required: true
	Feedback *string `json:"feedback"`

	// intake Id
	// Required: true
	IntakeID *string `json:"intakeId"`
}
