package intake

import (
	"context"
	"encoding/json"
	"fmt"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

func translateFeedback(_ context.Context, fb *models.GRTFeedback) (*wire.IntakeInput, error) {
	if fb == nil {
		return nil, fmt.Errorf("nil feedback received")
	}

	obj := wire.EASIGrtFeedback{
		IntakeID:     pStr(fb.IntakeID.String()),
		Feedback:     pStr(fb.Feedback),
		FeedbackType: pStr(string(fb.FeedbackType)),
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	result := wire.IntakeInput{
		ID:   pStr(fb.ID.String()),
		Body: pStr(string(blob)),

		// invariants for this type
		Status:     pStr(wire.IntakeInputStatusFinal),
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
		Type:       pStr(wire.IntakeInputTypeEASIGrtFeedback),
		Schema:     pStr(wire.IntakeInputSchemaEASIGrtFeedbackV01),
	}

	if fb.CreatedAt != nil {
		result.CreatedDate = pDateTime(fb.CreatedAt)
	}
	if fb.UpdatedAt != nil {
		result.LastUpdate = pDateTime(fb.CreatedAt)
	}

	return &result, nil
}
