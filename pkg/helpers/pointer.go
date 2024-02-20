package helpers

// PointerTo takes in any item and returns a pointer to that item
func PointerTo[T any](val T) *T {
	return &val
}
