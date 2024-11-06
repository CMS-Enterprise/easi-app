package translation

import (
	"context"
	"encoding/json"

	wire "github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/models"
	intakemodels "github.com/cms-enterprise/easi-app/pkg/cedar/intake/models"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TranslatableAction is a wrapper around our Action model for translating into the CEDAR Intake API schema
type TranslatableAction models.Action

// ObjectID is a unique identifier for a TranslatableAction
func (action *TranslatableAction) ObjectID() string {
	return action.ID.String()
}

// ObjectType is a human-readable identifier for the Action type, for use in logging
func (action *TranslatableAction) ObjectType() string {
	return "action"
}

// CreateIntakeModel translates an Action into an IntakeInput
func (action *TranslatableAction) CreateIntakeModel(ctx context.Context) (*wire.IntakeInput, error) {
	obj := intakemodels.EASIAction{
		IntakeID:   action.IntakeID.String(),
		ActionType: string(action.ActionType),
		ActorEUA:   action.ActorEUAUserID,
		Feedback:   action.Feedback.ValueOrEmptyString(),
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	result := wire.IntakeInput{
		ClientID: pStr(action.ID.String()),
		Body:     pStr(string(blob)),

		// invariants for this type
		ClientStatus: statusStr(inputStatusFinal),
		BodyFormat:   pStr(wire.IntakeInputBodyFormatJSON),
		Type:         typeStr(intakeInputAction),
		Schema:       versionStr(IntakeInputSchemaEASIActionVersion),
	}

	if action.CreatedAt != nil {
		result.ClientCreatedDate = pStrfmtDateTime(action.CreatedAt)
		result.ClientLastUpdatedDate = pStrfmtDateTime(action.CreatedAt)
	}

	return &result, nil
}
