package models

import "github.com/google/uuid"

// SystemShort has the basic information of a system, to be used in listing systems
type SystemShort struct {
	ID      uuid.UUID
	Acronym string
	Name    string
}

// System is the descriptive model for a system
type System struct {
	SystemShort SystemShort
	Description string
	Datapoint1  string
	Datapoint2  string
	Datapoint3  string
	Datapoint4  string
}

// SystemShorts is a list of systemShorts
type SystemShorts []SystemShort
