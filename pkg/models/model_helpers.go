package models

import "github.com/lib/pq"

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
