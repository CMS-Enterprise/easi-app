package models

// RequestRelationType represents an enum for different relation types of intakes
type RequestRelationType string

// Possible values of SystemIntakeRelationType
const (
	RelationTypeNewSystem       RequestRelationType = "NEW_SYSTEM"
	RelationTypeExistingSystem  RequestRelationType = "EXISTING_SYSTEM"
	RelationTypeExistingService RequestRelationType = "EXISTING_SERVICE"
)
