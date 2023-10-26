package models

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestContainsAllIDs(t *testing.T) {
	t.Run("Returns true when IDs are a subset of the IDs in the models", func(t *testing.T) {
		// any type of model that implements IBaseStruct could be used for testing, there's nothing special about TRBRequest
		trbRequest1 := &TRBRequest{
			BaseStruct: BaseStruct{
				ID: uuid.New(),
			},
		}
		trbRequest2 := &TRBRequest{
			BaseStruct: BaseStruct{
				ID: uuid.New(),
			},
		}
		models := []*TRBRequest{trbRequest1, trbRequest2}
		ids := []uuid.UUID{trbRequest1.ID}

		containsAllIDs := ContainsAllIDs(models, ids)
		assert.True(t, containsAllIDs)
	})

	t.Run("Returns false when there's an ID that's not an ID of one of the models", func(t *testing.T) {
		// any type of model that implements IBaseStruct could be used for testing, there's nothing special about TRBRequest
		// all UUIDs in this test are fixed for deterministic testing

		trbRequest1 := &TRBRequest{
			BaseStruct: BaseStruct{
				ID: uuid.MustParse("ae56c09d-c5b8-4b37-8c7f-2ba1324738df"),
			},
		}
		trbRequest2 := &TRBRequest{
			BaseStruct: BaseStruct{
				ID: uuid.MustParse("cf815dbd-f93d-4a6f-94d9-90dffff53929"),
			},
		}
		models := []*TRBRequest{trbRequest1, trbRequest2}

		differentID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
		ids := []uuid.UUID{differentID}

		containsAllIDs := ContainsAllIDs(models, ids)
		assert.False(t, containsAllIDs)
	})
}
