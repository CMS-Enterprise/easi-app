package models

import (
	"database/sql"
	"encoding/json"
)

// NullableString extends NullString for handling JSON conversion
type NullableString struct {
	sql.NullString
}

// MarshalJSON converts NullableString to JSON
func (ns NullableString) MarshalJSON() ([]byte, error) {
	if ns.Valid {
		return json.Marshal(ns.String)
	}
	return []byte("null"), nil
}

// UnmarshalJSON overrides the default behavior
// to allow for using a string instead of object in the API
func (ns *NullableString) UnmarshalJSON(data []byte) error {
	var contents string
	err := json.Unmarshal(data, &contents)
	if err != nil {
		return err
	}
	ns.String = contents
	ns.Valid = true
	return nil
}

// NullableBool extends NullBool for handling JSON conversion
type NullableBool struct {
	sql.NullBool
}

// MarshalJSON converts NullableBool to JSON
func (nb NullableBool) MarshalJSON() ([]byte, error) {
	if nb.Valid {
		return json.Marshal(nb.Bool)
	}
	return []byte("null"), nil
}
