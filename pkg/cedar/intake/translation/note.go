package translation

import (
	"context"
	"encoding/json"

	wire "github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/models"
	intakemodels "github.com/cms-enterprise/easi-app/pkg/cedar/intake/models"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TranslatableNote is a wrapper around our Note model for translating into the CEDAR Intake API schema
type TranslatableNote models.SystemIntakeNote

// ObjectID is a unique identifier for a TranslatableNote
func (note *TranslatableNote) ObjectID() string {
	return note.ID.String()
}

// ObjectType is a human-readable identifier for the Note type, for use in logging
func (note *TranslatableNote) ObjectType() string {
	return "note"
}

// CreateIntakeModel translates a Note into an IntakeInput
func (note *TranslatableNote) CreateIntakeModel(ctx context.Context) (*wire.IntakeInput, error) {
	obj := intakemodels.EASINote{
		IntakeID:  note.SystemIntakeID.String(),
		AuthorEUA: note.AuthorEUAID,
		Content:   note.Content.ValueOrEmptyString(),
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	result := wire.IntakeInput{
		ClientID: pStr(note.ID.String()),
		Body:     pStr(string(blob)),

		// invariants for this type
		ClientStatus: statusStr(inputStatusFinal),
		BodyFormat:   pStr(wire.IntakeInputBodyFormatJSON),
		Type:         typeStr(intakeInputNote),
		Schema:       versionStr(IntakeInputSchemaEASINoteVersion),
	}

	if note.CreatedAt != nil {
		result.ClientCreatedDate = pStrfmtDateTime(note.CreatedAt)
		result.ClientLastUpdatedDate = pStrfmtDateTime(note.CreatedAt)
	}

	return &result, nil
}
