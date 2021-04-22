package intake

import (
	"context"
	"encoding/json"
	"fmt"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

func translateAction(_ context.Context, action *models.Action) (*wire.IntakeInput, error) {
	if action == nil {
		return nil, fmt.Errorf("nil action received")
	}

	obj := wire.EASIAction{
		IntakeID:   pStr(action.IntakeID.String()),
		ActionType: pStr(string(action.ActionType)),
		ActorEUA:   pStr(action.ActorEUAUserID),
		Feedback:   pStr(action.Feedback.ValueOrZero()),
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	result := wire.IntakeInput{
		ID:   pStr(action.ID.String()),
		Body: pStr(string(blob)),

		// invariants for this type
		Status:     pStr(wire.IntakeInputStatusFinal),
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
		Type:       pStr(wire.IntakeInputTypeEASIAction),
		Schema:     pStr(wire.IntakeInputSchemaEASIActionV01),
	}

	if action.CreatedAt != nil {
		result.CreatedDate = pDateTime(action.CreatedAt)
		result.LastUpdate = pDateTime(action.CreatedAt)
	}

	return &result, nil
}
