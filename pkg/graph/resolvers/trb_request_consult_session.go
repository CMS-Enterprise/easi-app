package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// UpdateTRBRequestConsultSession updates a TRBRequestConsultSession record in the database
func UpdateTRBRequestConsultSession(ctx context.Context, store *storage.Store, session *models.TRBRequestConsultSession) (*models.TRBRequestConsultSession, error) {
	modifiedBy := appcontext.Principal(ctx).ID()
	session.ModifiedBy = &modifiedBy

	updatedSession, err := store.UpdateTRBRequestConsultSession(ctx, session)
	if err != nil {
		return nil, err
	}

	return updatedSession, nil

	// isSubmitted := false
	// if isSubmittedVal, isSubmittedFound := input["isSubmitted"]; isSubmittedFound {
	// 	if isSubmittedBool, isSubmittedOk := isSubmittedVal.(bool); isSubmittedOk {
	// 		isSubmitted = isSubmittedBool
	// 		delete(input, "isSubmitted")
	// 	}
	// }

	// form, err := store.GetTRBRequestConsultSessionByTRBRequestID(ctx, id)
	// if err != nil {
	// 	return nil, err
	// }
	// previousStatus := form.Status

	// err = ApplyChangesAndMetaData(input, form, appcontext.Principal(ctx))
	// if err != nil {
	// 	return nil, err
	// }

	// if isSubmitted && previousStatus != models.TRBFormStatusCompleted {
	// 	form.Status = models.TRBFormStatusCompleted

	// 	trb, err2 := store.GetTRBRequestByID(appcontext.ZLogger(ctx), id)
	// 	if err2 != nil {
	// 		return nil, err2
	// 	}

	// 	trbChanges := map[string]interface{}{
	// 		"feedbackStatus": models.TRBFeedbackStatusInReview,
	// 	}
	// 	err = ApplyChangesAndMetaData(trbChanges, trb, appcontext.Principal(ctx))
	// 	if err != nil {
	// 		return nil, err
	// 	}

	// 	_, err = store.UpdateTRBRequest(appcontext.ZLogger(ctx), trb)
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// } else if previousStatus != models.TRBFormStatusCompleted {
	// 	form.Status = models.TRBFormStatusInProgress
	// }

	// updatedForm, err := store.UpdateTRBRequestConsultSession(ctx, form)
	// if err != nil {
	// 	return nil, err
	// }

	// return updatedForm, nil
}

// GetTRBRequestConsultSessionByTRBRequestID retrieves a TRB request form record for a given TRB request ID
func GetTRBRequestConsultSessionByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequestConsultSession, error) {
	form, err := store.GetTRBRequestConsultSessionByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	return form, err
}
