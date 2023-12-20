package models

import "github.com/lib/pq"

// ValueOrEmpty returns a string if the input is not nil, otherwise returns an empty string
func ValueOrEmpty(st *string) string {
	if st != nil {
		return *st
	}
	return ""
}

// ConvertEnums converts a pq.StringArray to specific, castable type
func ConvertEnums[EnumType ~string](pqGroups pq.StringArray) []EnumType {
	enumValues := []EnumType{}
	for _, item := range pqGroups {
		enumValues = append(enumValues, EnumType(item))
	}
	return enumValues
}

// HTMLPointer returns a pointer to an HTML type from a string input
func HTMLPointer(input string) *HTML {
	html := HTML(input)
	return &html
}
