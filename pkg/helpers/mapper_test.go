package helpers

import (
	"testing"

	"github.com/google/uuid"
)

type mockMapper struct {
	id  uuid.UUID
	idx int
}

// impl GetMappingID interface
func (m mockMapper) GetMappingID() uuid.UUID {
	return m.id
}

func TestOneToMany(t *testing.T) {
	var (
		uuid1 = uuid.New()
		uuid2 = uuid.New()
		uuid3 = uuid.New()
		uuid4 = uuid.New()
	)

	// create some associations
	mockMappers := []mockMapper{
		{
			id:  uuid1,
			idx: 0,
		},
		{
			id:  uuid2,
			idx: 1,
		},
		{
			id:  uuid3,
			idx: 2,
		},
		{
			id:  uuid4,
			idx: 3,
		},
		{
			id:  uuid1,
			idx: 0,
		},
		{
			id:  uuid2,
			idx: 1,
		},
		{
			id:  uuid3,
			idx: 2,
		},
		{
			id:  uuid4,
			idx: 3,
		},
		{
			id:  uuid1,
			idx: 0,
		},
		{
			id:  uuid2,
			idx: 1,
		},
		{
			id:  uuid3,
			idx: 2,
		},
		{
			id:  uuid4,
			idx: 3,
		},
		{
			id:  uuid1,
			idx: 0,
		},
		{
			id:  uuid2,
			idx: 1,
		},
		{
			id:  uuid3,
			idx: 2,
		},
		{
			id:  uuid4,
			idx: 3,
		},
		{
			id:  uuid1,
			idx: 0,
		},
		{
			id:  uuid2,
			idx: 1,
		},
		{
			id:  uuid3,
			idx: 2,
		},
		{
			id:  uuid4,
			idx: 3,
		},
	}

	data := OneToMany[mockMapper]([]uuid.UUID{uuid1, uuid2, uuid3, uuid4}, mockMappers)
	if len(data) < 1 {
		t.Error("expected data to not be empty")
	}

	for i, resultSet := range data {
		if len(resultSet) < 1 {
			t.Errorf("expected result set %[1]d to not be empty", i)
		}

		for _, mapper := range resultSet {
			if mapper.idx != i {
				t.Errorf("expected mapper idx %[1]d to equal iteration idx %[2]d", mapper.idx, i)
			}
		}
	}
}
