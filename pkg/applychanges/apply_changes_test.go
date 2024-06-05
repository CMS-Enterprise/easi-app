package applychanges

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

func TestSanitizeChangesEnumStrings(t *testing.T) {
	clayChanges := map[string]interface{}{
		"state": models.TRBRequestStateOpen, // testing an enum type that should get converted to a string
	}
	sanitizeChanges(clayChanges)

	assert.IsType(t, "", clayChanges["state"]) // check that its a string (""), not a TRBRequestState
	assert.Equal(t, "OPEN", clayChanges["state"])
}

type Person struct {
	Name      string   `json:"name"`
	Age       int      `json:"age"`
	Nicknames []string `json:"nicknames"`
}

func TestApplyChanges(t *testing.T) {
	clay := Person{"Clay", 27, []string{"Clayboy", "Claysadilla"}}

	clayChanges := map[string]interface{}{
		"age": 28,
	}
	err := ApplyChanges(clayChanges, &clay)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, "Clay", clay.Name)
	assert.Equal(t, 28, clay.Age)
	assert.Equal(t, []string{"Clayboy", "Claysadilla"}, clay.Nicknames)

	clayChanges = map[string]interface{}{
		"nicknames": []string{},
	}
	err = ApplyChanges(clayChanges, &clay)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, "Clay", clay.Name)
	assert.Equal(t, 28, clay.Age)
	assert.Equal(t, []string{}, clay.Nicknames)

	clayChanges = map[string]interface{}{
		"nicknames": []string{"Clayson the Wise"},
		"age":       50,
	}
	err = ApplyChanges(clayChanges, &clay)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, "Clay", clay.Name)
	assert.Equal(t, 50, clay.Age)
	assert.Equal(t, []string{"Clayson the Wise"}, clay.Nicknames)
}

type PersonWithPointer struct {
	Name   string  `json:"name"`
	Parent *string `json:"parent"`
}

func TestApplyChangesEmptyString(t *testing.T) {
	mom := "Mom"
	son := PersonWithPointer{Name: "Son", Parent: &mom}

	sonChanges := map[string]interface{}{
		"parent": "",
	}
	err := ApplyChanges(sonChanges, &son)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, "Son", son.Name)
	assert.Nil(t, son.Parent) // should set to nil
}

type AwkwardFirstDate struct {
	WhenStarted time.Time `json:"whenStarted"`
	WhenEnded   time.Time `json:"whenEnded"`
	DidHaveFun  bool      `json:"didHaveFun"`
}

func TestApplyChangesWithTime(t *testing.T) {
	fd := AwkwardFirstDate{
		WhenStarted: time.Now(),
		WhenEnded:   time.Now(),
		DidHaveFun:  false,
	}

	fdChanges := map[string]interface{}{
		"whenStarted": time.Date(2022, 5, 8, 18, 0, 0, 0, time.UTC), // should work with 'time.Time's
		"whenEnded":   "2022-05-08T21:00:00Z",                       // and should work with strings in time.RFC3339Nano format
	}
	err := ApplyChanges(fdChanges, &fd)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, time.Date(2022, 5, 8, 18, 0, 0, 0, time.UTC), fd.WhenStarted)
	assert.Equal(t, time.Date(2022, 5, 8, 21, 0, 0, 0, time.UTC), fd.WhenEnded)
	assert.Equal(t, false, fd.DidHaveFun)

	fdChanges = map[string]interface{}{
		"didHaveFun": true,
	}
	err = ApplyChanges(fdChanges, &fd)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, time.Date(2022, 5, 8, 18, 0, 0, 0, time.UTC), fd.WhenStarted)
	assert.Equal(t, time.Date(2022, 5, 8, 21, 0, 0, 0, time.UTC), fd.WhenEnded)
	assert.Equal(t, true, fd.DidHaveFun)
}

type PersonWithUUID struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

// TestApplyChangesUUID tests that ApplyChanges works with UUIDs
// Note that this isn't how GQL passes UUIDs to resolvers, but is something we hackily use
// in tests to modify the ID of an entity.
func TestApplyChangesUUID(t *testing.T) {
	clay := PersonWithUUID{uuid.MustParse("cfe0965f-aa95-4ade-af54-838a85cc6644"), "Clay"}

	// decodeData, decodeErr := hex.DecodeString("02a9920eb0154de38e32fb965ac4653c")
	// if decodeErr != nil {
	// 	t.Errorf("Failed to decode UUID: %s", decodeErr)
	// }
	clayChanges := map[string]interface{}{
		"id": []byte{0x2, 0xa9, 0x92, 0xe, 0xb0, 0x15, 0x4d, 0xe3, 0x8e, 0x32, 0xfb, 0x96, 0x5a, 0xc4, 0x65, 0x3c},
	}
	err := ApplyChanges(clayChanges, &clay)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, "02a9920e-b015-4de3-8e32-fb965ac4653c", clay.ID.String())
	assert.Equal(t, "Clay", clay.Name)
}
