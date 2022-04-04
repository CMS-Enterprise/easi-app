package translation

// from the Swagger (cedar_intake.json, definitions/IntakeInput/properties/clientStatus):
// "Client's status associated with the object being transmitted, i.e. Initiated, Final, etc."
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
	// IntakeInputSchemaEASIActionVersion captures enum value "EASIActionV01"
	IntakeInputSchemaEASIActionVersion SchemaVersion = "EASIActionV01"

	// IntakeInputSchemaEASIBizCaseVersion captures enum value "EASIBizCaseV02"
	IntakeInputSchemaEASIBizCaseVersion SchemaVersion = "EASIBizCaseV02"

	// IntakeInputSchemaEASIGrtFeedbackVersion captures enum value "EASIGrtFeedbackV01"
	IntakeInputSchemaEASIGrtFeedbackVersion SchemaVersion = "EASIGrtFeedbackV01"

	// IntakeInputSchemaEASIIntakeVersion captures enum value "EASIIntakeV02"
	IntakeInputSchemaEASIIntakeVersion SchemaVersion = "EASIIntakeV02"

	// IntakeInputSchemaEASINoteVersion captures enum value "EASINoteV01"
	IntakeInputSchemaEASINoteVersion SchemaVersion = "EASINoteV01"
)
