package resolvers

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// UpdateTRBRequestForm updates a TRBRequestForm record in the database
func UpdateTRBRequestForm(ctx context.Context, store *storage.Store, input map[string]interface{}) (*models.TRBRequestForm, error) {
	idStr, idFound := input["trbRequestId"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
	}

	id, err := uuid.Parse(idStr.(string))
	if err != nil {
		return nil, err
	}

	isSubmitted := false
	if isSubmittedVal, isSubmittedFound := input["isSubmitted"]; isSubmittedFound {
		if isSubmittedBool, isSubmittedOk := isSubmittedVal.(bool); isSubmittedOk {
			isSubmitted = isSubmittedBool
			delete(input, "isSubmitted")
		}
	}

	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}
	previousStatus := form.Status

	err = ApplyChangesAndMetaData(input, form, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	if isSubmitted && previousStatus != models.TRBFormStatusCompleted {
		form.Status = models.TRBFormStatusCompleted

		trb, err2 := store.GetTRBRequestByID(appcontext.ZLogger(ctx), id)
		if err2 != nil {
			return nil, err2
		}

		trbChanges := map[string]interface{}{
			"feedbackStatus": models.TRBFeedbackStatusInReview,
		}
		err = ApplyChangesAndMetaData(trbChanges, trb, appcontext.Principal(ctx))
		if err != nil {
			return nil, err
		}

		_, err = store.UpdateTRBRequest(appcontext.ZLogger(ctx), trb)
		if err != nil {
			return nil, err
		}
	} else if previousStatus != models.TRBFormStatusCompleted {
		form.Status = models.TRBFormStatusInProgress
	}

	updatedForm, err := store.UpdateTRBRequestForm(ctx, form)
	if err != nil {
		return nil, err
	}

	return updatedForm, nil
}

// GetTRBRequestFormByTRBRequestID retrieves a TRB request form record for a given TRB request ID
func GetTRBRequestFormByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequestForm, error) {
	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	return form, err
}
