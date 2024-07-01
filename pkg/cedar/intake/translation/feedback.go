package translation

// import (
// 	"encoding/json"

// 	wire "github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/models"
// 	intakemodels "github.com/cms-enterprise/easi-app/pkg/cedar/intake/models"
// 	"github.com/cms-enterprise/easi-app/pkg/models"
// )

// // TranslatableFeedback is a wrapper around our GRTFeedback model for translating into the CEDAR Intake API schema
// type TranslatableFeedback models.GRTFeedback

// // ObjectID is a unique identifier for a TranslatableFeedback
// func (fb *TranslatableFeedback) ObjectID() string {
// 	return fb.ID.String()
// }

// // ObjectType is a human-readable identifier for the GRTFeedback type, for use in logging
// func (fb *TranslatableFeedback) ObjectType() string {
// 	return "GRT feedback"
// }

// // CreateIntakeModel translates a GRTFeedback into an IntakeInput
// func (fb *TranslatableFeedback) CreateIntakeModel() (*wire.IntakeInput, error) {
// 	obj := intakemodels.EASIGrtFeedback{
// 		FeedbackID:   fb.ID.String(),
// 		IntakeID:     fb.IntakeID.String(),
// 		Feedback:     fb.Feedback.ValueOrEmptyString(),
// 		FeedbackType: string(fb.FeedbackType),
// 	}

// 	blob, err := json.Marshal(&obj)
// 	if err != nil {
// 		return nil, err
// 	}

// 	result := wire.IntakeInput{
// 		ClientID: pStr(fb.ID.String()),
// 		Body:     pStr(string(blob)),

// 		// invariants for this type
// 		ClientStatus: statusStr(inputStatusFinal),
// 		BodyFormat:   pStr(wire.IntakeInputBodyFormatJSON),
// 		Type:         typeStr(intakeInputGrtFeedback),
// 		Schema:       versionStr(IntakeInputSchemaEASIGrtFeedbackVersion),
// 	}

// 	if fb.CreatedAt != nil {
// 		result.ClientCreatedDate = pStrfmtDateTime(fb.CreatedAt)
// 	}
// 	if fb.UpdatedAt != nil {
// 		result.ClientLastUpdatedDate = pStrfmtDateTime(fb.UpdatedAt)
// 	}

// 	return &result, nil
// }
