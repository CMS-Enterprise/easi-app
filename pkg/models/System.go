package models

import "github.com/google/uuid"

// System is the model for a system
type System struct {
	ID          uuid.UUID
	Acronym     string
	Name        string
	Description string
	Datapoint1  string
	Datapoint2  string
	Datapoint3  string
	Datapoint4  string
}

// Systems is a list of systems
type Systems []System
