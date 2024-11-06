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
		if reflectValue.Kind() == reflect.String {
			valAsString, ok := reflectValue.Interface().(string)

			// Convert empty strings to `nil`
			if ok && len(valAsString) == 0 {
				changes[key] = nil
				continue
			}
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

			// If the destination implements graphql.Unmarshaler
			if reflect.PointerTo(b).Implements(reflect.TypeOf((*graphql.Unmarshaler)(nil)).Elem()) {
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
