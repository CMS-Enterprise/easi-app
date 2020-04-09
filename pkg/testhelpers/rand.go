package testhelpers

import (
	"math/rand"
	"time"
)

// RandomEUAID returns a random EUA ID for testing
func RandomEUAID() string {
	rand.Seed(time.Now().UnixNano())
	const euaLength = 4
	var letter = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	b := make([]rune, euaLength)
	for i := range b {
		b[i] = letter[rand.Intn(len(letter))]
	}
	return string(b)
}
