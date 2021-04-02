package intake

import (
	"context"
	"encoding/json"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

// func translateActions(c context.Context, actions []*models.Action) ([]*wire.IntakeInput, error) {
// 	var results []*wire.IntakeInput
// 	for _, action := range actions {
// 		ii, err := translateAction(c, action)
// 		if err != nil {
// 			return nil, err
// 		}
// 		results = append(results, ii)
// 	}
// 	return results, nil
// }

func translateAction(_ context.Context, action *models.Action) (*wire.IntakeInput, error) {
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
