package helpers

// Chunk takes in any slice and returns X number of slices all with len equal to or shorter than `chunkSize`
// source: https://stackoverflow.com/a/72408490
func Chunk[T any](items []T, chunkSize int) [][]T {
	var chunks [][]T

	for chunkSize < len(items) {
		items, chunks = items[chunkSize:], append(chunks, items[0:chunkSize:chunkSize])
	}

	// append final batch
	chunks = append(chunks, items)
	return chunks
}
