package translation

// quoth the Swagger (cedar_intake.json): "Client's status associated with the object being transmitted, i.e. Initiated, Final, etc."
type intakeInputStatus string

const (
	// inputStatusInitiated indicates an object has been created within EASi, but is not yet finalized
	inputStatusInitiated intakeInputStatus = "Initiated"

	// inputStatusFinal indicates an object has been finalized in EASi
	// applies to:
	// * all actions
	// * closed business cases
	// * all GRT feedback entries
	// * all notes
	// * closed system intakes
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

// SchemaVersion is a human-readable version for the schemas EASi sends to the CEDAR Intake API
type SchemaVersion string

const (
	// IntakeInputSchemaEASIActionV01 captures enum value "EASIActionV01"
	IntakeInputSchemaEASIActionV01 SchemaVersion = "EASIActionV01"

	// IntakeInputSchemaEASIBizCaseV01 captures enum value "EASIBizCaseV01"
	IntakeInputSchemaEASIBizCaseV01 SchemaVersion = "EASIBizCaseV01"

	// IntakeInputSchemaEASIGrtFeedbackV01 captures enum value "EASIGrtFeedbackV01"
	IntakeInputSchemaEASIGrtFeedbackV01 SchemaVersion = "EASIGrtFeedbackV01"

	// IntakeInputSchemaEASIIntakeV01 captures enum value "EASIIntakeV01"
	IntakeInputSchemaEASIIntakeV01 SchemaVersion = "EASIIntakeV01"

	// IntakeInputSchemaEASINoteV01 captures enum value "EASINoteV01"
	IntakeInputSchemaEASINoteV01 SchemaVersion = "EASINoteV01"
)
