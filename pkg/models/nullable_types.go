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
