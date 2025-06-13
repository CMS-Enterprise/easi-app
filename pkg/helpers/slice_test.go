package helpers

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestChunk(t *testing.T) {
	type testCase[T any] struct {
		size int
		test []T
		want [][]T
	}

	tcString := testCase[string]{
		size: 2,
		test: []string{"hello", "world", "second", "slice", "third", "slice"},
		want: [][]string{{"hello", "world"}, {"second", "slice"}, {"third", "slice"}},
	}

	resStr := Chunk(tcString.test, tcString.size)
	if !assert.Equal(t, tcString.want, resStr) {
		t.Fail()
	}

	tcInt := testCase[int]{
		size: 5,
		test: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16},
		want: [][]int{{1, 2, 3, 4, 5}, {6, 7, 8, 9, 10}, {11, 12, 13, 14, 15}, {16}},
	}

	resInt := Chunk(tcInt.test, tcInt.size)
	if !assert.Equal(t, tcInt.want, resInt) {
		t.Fail()
	}
}
