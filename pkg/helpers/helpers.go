package helpers

import "time"

// DatesEqual compares 2 *time.Time. If either is nil, returns false.
// Otherwise, returns true if the years, months, and days are the same.
func DatesEqual(d1, d2 *time.Time) bool {
	if d1 == nil || d2 == nil {
		return false
	}

	yearsSame := d1.Year() == d2.Year()
	monthsSame := d1.Month() == d2.Month()
	daysSame := d1.Day() == d2.Day()
	return yearsSame && monthsSame && daysSame
}

// MapSlice performs a functional mapping operation transforming each item in a slice
// and placing it in a new slice of the same length.
func MapSlice[T any, R any](s []T, fx func(s T) R) []R {
	var r []R
	for _, item := range s {
		r = append(r, fx(item))
	}
	return r
}

// SliceToMap converts a slice to a Map where the function is used to return the key by which
// each item will be placed in the map
func SliceToMap[T any, K comparable](s []T, fx func(s T) K) map[K]T {
	r := map[K]T{}
	for _, item := range s {
		key := fx(item)
		r[key] = item
	}
	return r
}

// MapToSlice converts a Map back into a Slice
func MapToSlice[T any, K comparable](m map[K]T) []T {
	var r []T
	for _, v := range m {
		r = append(r, v)
	}
	return r
}
