package applychanges

import (
	"reflect"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/mitchellh/mapstructure"
)

// sanitizeChanges performs some pre-processing of the changes map for "known" cases that we'd like to handle.
// Currently, these include:
// - Empty strings are converted to nil
// - Empty slices are converted to nil
func sanitizeChanges(changes map[string]interface{}) {
	for key, value := range changes {
		// Get the reflect value for type comparisons
		reflectValue := reflect.ValueOf(value)

		// String operations
		// If the value is a string, we need to do a few things:
		// 1) Convert empty strings to `nil`
		// 2) Ensure that, for the sake of ApplyChanges calling `UnmarshalGQL` on custom enums, we convert the type to an actual `string`
		//    This second step is necessary because gqlgen tries to call `UnmarshalGQL` on enum types, which attempts
		//    to convert interface{} to string, but fails because the type is not actually a string (but is whatever type defined in models_gen.go)
		if reflectValue.Kind() == reflect.String {
			valAsString := reflectValue.String() // safe to do since we know reflectValue.Kind() is reflect.String

			// Convert empty strings to `nil`
			if len(valAsString) == 0 {
				changes[key] = nil
				continue
			}

			// Modify changes map to have "string" version of enums that are not technically of type `string`
			changes[key] = valAsString
		}

		// Empty slices don't play well with mapstructure, as they enter as []interface{}
		// which promptly gets ignored by mapstructure.
		// In order to get around this, we'll convert empty slices to a real "nil" value
		if reflectValue.Kind() == reflect.Slice && reflectValue.IsNil() {
			changes[key] = nil
		}
	}
}

// ApplyChanges applies arbitrary changes from a map to a struct. Any field not mentioned in the changes object will remain the same
// Code largely copied from GQLGen's docs on changesets
// https://gqlgen.com/reference/changesets/
func ApplyChanges(changes map[string]interface{}, to interface{}) error {
	sanitizeChanges(changes)

	// Set up the decoder. This is almost exactly ripped from https://gqlgen.com/reference/changesets/
	dec, err := mapstructure.NewDecoder(&mapstructure.DecoderConfig{
		ErrorUnused: true,
		TagName:     "json",
		Result:      to,
		ZeroFields:  true,
		Squash:      true,
		// This is needed to get mapstructure to call the gqlgen unmarshaler func for custom scalars (eg Date)
		DecodeHook: func(a reflect.Type, b reflect.Type, v interface{}) (interface{}, error) {
			// If the destination is a time.Time and we need to parse it from a string
			if b == reflect.TypeOf(time.Time{}) && a == reflect.TypeOf("") {
				t, err := time.Parse(time.RFC3339Nano, v.(string))
				return t, err
			}

			// If the destination is a uuid.UUID and we need to parse it from a string
			if b == reflect.TypeOf(uuid.UUID{}) && a == reflect.TypeOf("") {
				u, err := uuid.Parse(v.(string))
				return u, err
			}

			// If the desination implements graphql.Unmarshaler
			if reflect.PtrTo(b).Implements(reflect.TypeOf((*graphql.Unmarshaler)(nil)).Elem()) {
				resultType := reflect.New(b)
				result := resultType.MethodByName("UnmarshalGQL").Call([]reflect.Value{reflect.ValueOf(v)})
				err, _ := result[0].Interface().(error)
				return resultType.Elem().Interface(), err
			}

			return v, nil
		},
	})

	if err != nil {
		return err
	}

	return dec.Decode(changes)
}
