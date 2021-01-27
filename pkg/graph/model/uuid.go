package model

import (
	"errors"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
)

// MarshalUUID allows uuid to be marshalled by graphql
func MarshalUUID(id uuid.UUID) graphql.Marshaler {
	return graphql.MarshalString(id.String())
}

// UnmarshalUUID allows uuid to be unmarshalled by graphql
func UnmarshalUUID(v interface{}) (uuid.UUID, error) {
	if idAsString, ok := v.(string); ok {
		if id, err := uuid.Parse(idAsString); err != nil {
			return id, nil
		}
	}
	return uuid.Nil, errors.New("id should be a valid UUID")
}
