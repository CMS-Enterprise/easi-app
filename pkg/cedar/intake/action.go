package intake

import (
	"context"
	"encoding/json"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	intakemodels "github.com/cmsgov/easi-app/pkg/cedar/intake/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

func translateAction(_ context.Context, action models.Action) (*wire.IntakeInput, error) {
	obj := intakemodels.EASIAction{
		IntakeID:   action.IntakeID.String(),
		ActionType: string(action.ActionType),
		ActorEUA:   action.ActorEUAUserID,
		Feedback:   action.Feedback.ValueOrZero(),
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
