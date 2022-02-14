package translation

type intakeInputStatus string

const (
	// inputStatusInitiated indicates an object has been created within EASi, but is not yet finalized
	inputStatusInitiated intakeInputStatus = "Initiated"

	// inputStatusFinal indicates an object has been finalized in EASi
	inputStatusFinal intakeInputStatus = "Final"
)

type intakeInputType string

const (
	intakeInputAction       intakeInputType = "EASIAction"
	intakeInputBizCase      intakeInputType = "EASIBizCase"
	intakeInputGrtFeedback  intakeInputType = "EASIGrtFeedback"
	intakeInputSystemIntake intakeInputType = "EASIIntake"
	intakeInputNote         intakeInputType = "EASINote"
)

// TODO - move schema versions in here?
