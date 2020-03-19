package models

import (
	"database/sql"
	"encoding/json"
)

// NullableString is a wrapper for NullString that gracefully translates to JSON.
type NullableString sql.NullString

// MarshalJSON defines how NullableString translates to JSON in client response.
func (ns NullableString) MarshalJSON() ([]byte, error) {
	if ns.Valid {
		return json.Marshal(ns.String)
	}
	return json.Marshal("")
}
