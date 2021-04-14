package intake

import (
	"context"
	"encoding/json"
	"fmt"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

func translateNote(_ context.Context, note *models.Note) (*wire.IntakeInput, error) {
	if note == nil {
		return nil, fmt.Errorf("nil note received")
	}

	obj := wire.EASINote{
		IntakeID:  pStr(note.SystemIntakeID.String()),
		AuthorEUA: pStr(note.AuthorEUAID),
		Content:   pStr(note.Content.ValueOrZero()),
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
