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
	// IntakeInputSchemaEASIActionVersion captures the current schema version for Actions
	IntakeInputSchemaEASIActionVersion SchemaVersion = "EASIActionV01"

	// IntakeInputSchemaEASIBizCaseVersion captures the current schema version for Business Cases
	IntakeInputSchemaEASIBizCaseVersion SchemaVersion = "EASIBizCaseV03"

	// IntakeInputSchemaEASIGrtFeedbackVersion captures the current schema version for GRT Feedback
	IntakeInputSchemaEASIGrtFeedbackVersion SchemaVersion = "EASIGrtFeedbackV02"

	// IntakeInputSchemaEASIIntakeVersion captures the current schema version for System Intakes
	IntakeInputSchemaEASIIntakeVersion SchemaVersion = "EASIIntakeV06"

	// IntakeInputSchemaEASINoteVersion captures the current schema version for Notes
	IntakeInputSchemaEASINoteVersion SchemaVersion = "EASINoteV01"
)

// PersonRole is an enumeration of values representing the role of a person (currently in use for
// TRBRequestAttendee and potentially SystemIntakeContact)
type PersonRole string

const (
	// PersonRoleProductOwner is a person with the "Product Owner" role
	PersonRoleProductOwner PersonRole = "PRODUCTOWNER"
	// PersonRoleSystemOwner is a person with the "System Owner" role
	PersonRoleSystemOwner PersonRole = "SYSTEMOWNER"
	// PersonRoleSystemMaintainer is a person with the "System Maintainer" role
	PersonRoleSystemMaintainer PersonRole = "SYSTEMMAINTAINER"
	// PersonRoleContractOfficersRepresentative is a person with the "ContractOfficersRepresentative" role
	PersonRoleContractOfficersRepresentative PersonRole = "CONTRACTOFFICERSREPRESENTATIVE"
	// PersonRoleCloudNavigator is a person with the "Cloud Navigator" role
	PersonRoleCloudNavigator PersonRole = "CLOUDNAVIGATOR"
	// PersonRolePrivacyAdvisor is a person with the "Privacy Advisor" role
	PersonRolePrivacyAdvisor PersonRole = "PRIVACYADVISOR"
	// PersonRoleCRA is a person with the "CRA" role
	PersonRoleCRA PersonRole = "CRA"
	// PersonRoleOther is a person with the "Other" role
	PersonRoleOther PersonRole = "OTHER"
	// PersonRoleUnknown is a person with an "Unknown" role
	PersonRoleUnknown PersonRole = "UNKNOWN"
)
