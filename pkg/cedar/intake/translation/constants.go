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
	// * closed Business Cases
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
	// IntakeInputSchemaEASIActionVersion captures the current schema version for Actions
	IntakeInputSchemaEASIActionVersion SchemaVersion = "EASIActionV01"

	// IntakeInputSchemaEASIBizCaseVersion captures the current schema version for Business Cases
	IntakeInputSchemaEASIBizCaseVersion SchemaVersion = "EASIBizCaseV05"

	// IntakeInputSchemaEASIGrtFeedbackVersion captures the current schema version for GRT Feedback
	IntakeInputSchemaEASIGrtFeedbackVersion SchemaVersion = "EASIGrtFeedbackV02"

	// IntakeInputSchemaEASIIntakeVersion captures the current schema version for System Intakes
	IntakeInputSchemaEASIIntakeVersion SchemaVersion = "EASIIntakeV08"

	// IntakeInputSchemaEASINoteVersion captures the current schema version for Notes
	IntakeInputSchemaEASINoteVersion SchemaVersion = "EASINoteV01"
)
