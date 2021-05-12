package intake

import (
	"context"
	"encoding/json"
	"strconv"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

func translateLifecycleCost(_ context.Context, bcID string, lc models.EstimatedLifecycleCost) (*wire.IntakeInput, error) {
	obj := wire.EASILifecycleCost{
		BusinessCaseID: pStr(bcID),
		Solution:       pStr(string(lc.Solution)),
		Year:           pStr(string(lc.Year)),
	}
	phase := ""
	if lc.Phase != nil {
		phase = string(*lc.Phase)
	}
	obj.Phase = pStr(phase)

	cost := ""
	if lc.Cost != nil {
		cost = strconv.Itoa(*lc.Cost)
	}
	obj.Cost = pStr(cost)

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	result := &wire.IntakeInput{
		ID:   pStr(lc.ID.String()),
		Body: pStr(string(blob)),

		// invariants for this type
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
		Type:       pStr(wire.IntakeInputTypeEASILifecycleCost),
		Schema:     pStr(wire.IntakeInputSchemaEASILifecycleCostV01),

		// these fields will be inherited/applied from the wrapping business case
		// Status:     pStr(wire.IntakeInputStatusFinal),
		// CreatedDate: pDateTime(lc.CreatedAt)
		// LastUpdate: pDateTime(lc.CreatedAt)
	}

	// _ = result
	// return nil, fmt.Errorf("not yet implemented")
	return result, nil
}
