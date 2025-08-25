package models

import (
	"github.com/guregu/null/zero"
	"github.com/lib/pq"
)

// ConvertEnums converts a pq.StringArray to specific, castable type
func ConvertEnums[EnumType ~string](pqGroups pq.StringArray) []EnumType {
	enumValues := []EnumType{}
	for _, item := range pqGroups {
		enumValues = append(enumValues, EnumType(item))
	}
	return enumValues
}

// ConvertEnumsToStringArray converts an enum array to a pq.StringArray
func ConvertEnumsToStringArray[EnumType ~string](arr []EnumType) pq.StringArray {
	sa := make(pq.StringArray, len(arr))
	for i, r := range arr {
		sa[i] = string(r)
	}

	return sa
}

// HTMLPointer returns a pointer to an HTML type from a string input
func HTMLPointer(input string) *HTML {
	html := HTML(input)
	return &html
}

func ZeroStringsFrom(strs []string) []zero.String {
	retStrs := []zero.String{}
	for _, s := range strs {
		retStrs = append(retStrs, zero.StringFrom(s))
	}
	return retStrs
}

func StringsFromZeroStrs(zs []zero.String) []string {
	retStrs := []string{}
	for _, s := range zs {
		retStrs = append(retStrs, s.String)
	}
	return retStrs
}
