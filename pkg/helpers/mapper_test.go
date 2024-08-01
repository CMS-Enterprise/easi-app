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
func (m mockMapper) GetMappingKey() uuid.UUID {
	return m.id
}

// impl GetMappingID interface
func (m mockMapper) GetMappingVal() *mockMapper {
	return &m
}

func TestOneToMany(t *testing.T) {
	var (
		uuid1 = uuid.New()
		uuid2 = uuid.New()
		uuid3 = uuid.New()
		uuid4 = uuid.New()
	)

	ids := []uuid.UUID{uuid1, uuid2, uuid3, uuid4}
	// create some associations
	mockMappers := []mockMapper{}

	// OneToMany groups by id, so relatedID and idx should be the matching index of the slice of ids
	// uuid1 should have idx 0, uuid2 should have idx 1, etc.
	for i := range 20 {
		mockMappers = append(mockMappers, mockMapper{
			id:  ids[i%len(ids)],
			idx: i % len(ids),
		})
	}

	data := OneToMany([]uuid.UUID{uuid1, uuid2, uuid3, uuid4}, mockMappers)
	if len(data) < 1 {
		t.Error("expected data to not be empty")
	}

	for i, resultSet := range data {
		if len(resultSet) < 1 {
			t.Errorf("expected result set %[1]d to not be empty", i)
		}

		for _, mapper := range resultSet {
			if mapper.id != ids[i] {
				t.Errorf("expected mapper id %v to be id list index %[1]d", mapper.id, i)
			}
			if mapper.idx != i {
				t.Errorf("expected mapper idx %[1]d to equal iteration idx %[2]d", mapper.idx, i)
			}
		}
	}
}

type mockEmbedded struct {
	mockMapper
	relatedID int
}

func (m mockEmbedded) GetMappingKey() uuid.UUID {
	return m.id
}

func (m mockEmbedded) GetMappingVal() *mockMapper {
	return &m.mockMapper
}

func TestOneToManyEmbedded(t *testing.T) {
	var (
		uuid1 = uuid.New()
		uuid2 = uuid.New()
		uuid3 = uuid.New()
		uuid4 = uuid.New()
	)

	ids := []uuid.UUID{uuid1, uuid2, uuid3, uuid4}
	// create some associations
	mockMappers := []mockEmbedded{}

	// OneToMany groups by id, so relatedID and idx should be the matching index of the slice of ids
	// uuid1 should have idx 0, uuid2 should have idx 1, etc.
	for i := range 20 {
		mapper := mockMapper{
			id:  ids[i%len(ids)],
			idx: i % len(ids), // mirrors relatedID since GetMappingVal returns the embedded struct in this case
		}
		embed := mockEmbedded{
			mockMapper: mapper,
			relatedID:  i % len(ids),
		}
		mockMappers = append(mockMappers, embed)
	}

	data := OneToMany([]uuid.UUID{uuid1, uuid2, uuid3, uuid4}, mockMappers)
	if len(data) < 1 {
		t.Error("expected data to not be empty")
	}

	for i, resultSet := range data {
		if len(resultSet) < 1 {
			t.Errorf("expected result set %[1]d to not be empty", i)
		}

		for _, mapper := range resultSet {
			if mapper.id != ids[i] {
				t.Errorf("expected mapper id %v to be id list index %[1]d", mapper.id, i)
			}
			if mapper.idx != i {
				t.Errorf("expected mapper idx %[1]d to equal iteration idx %[2]d", mapper.idx, i)
			}
		}
	}
}
