package intake

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
