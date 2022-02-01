package intake

import (
	"context"
	"encoding/json"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	intakemodels "github.com/cmsgov/easi-app/pkg/cedar/intake/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

func translateNote(_ context.Context, note models.Note) (*wire.IntakeInput, error) {
	obj := intakemodels.EASINote{
		IntakeID:  note.SystemIntakeID.String(),
		AuthorEUA: note.AuthorEUAID,
		Content:   note.Content.ValueOrZero(),
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	result := wire.IntakeInput{
		ID:   pStr(note.ID.String()),
		Body: pStr(string(blob)),

		// invariants for this type
		Status:     pStr(wire.IntakeInputStatusFinal),
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
		Type:       pStr(wire.IntakeInputTypeEASINote),
		Schema:     pStr(wire.IntakeInputSchemaEASINoteV01),
	}

	if note.CreatedAt != nil {
		result.CreatedDate = pDateTime(note.CreatedAt)
		result.LastUpdate = pDateTime(note.CreatedAt)
	}

	return &result, nil
}
