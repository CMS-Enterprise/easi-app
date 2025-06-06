package models

import (
	"database/sql/driver"
	"encoding/json"

	"github.com/lib/pq"
)

// EnumArray is a custom type that represents an array of enum values.
// it utilizes generics to provide type safety for enum values represented as strings.
// Under the hood, it uses pq.StringArray for database interactions
type EnumArray[enumType ~string] []enumType

// Scan implements the Scanner interface to decode data from the database
func (e *EnumArray[EnumType]) Scan(value interface{}) error {
	var stringArray pq.StringArray
	if err := stringArray.Scan(value); err != nil {
		return err
	}

	*e = make(EnumArray[EnumType], len(stringArray))
	for i, v := range stringArray {
		(*e)[i] = EnumType(v)
	}
	return nil
}

// Value implements the Valuer interface to encode data into the database
func (e EnumArray[EnumType]) Value() (driver.Value, error) {
	stringArray := make([]string, len(e))
	for i, v := range e {
		stringArray[i] = string(v)
	}
	return pq.StringArray(stringArray).Value()
}

// MarshalJSON marshals the EnumArray into JSON for GraphQL
func (e EnumArray[EnumType]) MarshalJSON() ([]byte, error) {
	return json.Marshal([]EnumType(e))
}

// UnmarshalJSON un marshals the EnumArray from JSON for GraphQL
func (e *EnumArray[EnumType]) UnmarshalJSON(data []byte) error {
	var stringArray []string
	if err := json.Unmarshal(data, &stringArray); err != nil {
		return err
	}

	*e = make(EnumArray[EnumType], len(stringArray))
	for i, v := range stringArray {
		(*e)[i] = EnumType(v)
	}
	return nil
}
