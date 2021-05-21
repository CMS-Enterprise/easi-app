package testhelpers

import (
	"math/rand"
	"time"

	"github.com/guregu/null"
)

// RandomEUAID returns a random EUA ID for testing
func RandomEUAID() string {
	rand.Seed(time.Now().UnixNano())
	const euaLength = 4
	var letter = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	b := make([]rune, euaLength)
	for i := range b {
		// #nosec G404
		b[i] = letter[rand.Intn(len(letter))]
	}
	return string(b)
}

// RandomEUAIDNull returns a random EUA ID for testing,
// in the form of a null.String
func RandomEUAIDNull() null.String {
	return null.StringFrom(RandomEUAID())
}
