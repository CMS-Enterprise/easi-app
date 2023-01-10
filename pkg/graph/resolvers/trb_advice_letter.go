package resolvers

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// GetTRBAdviceLetterByTRBRequestID fetches a TRB advice letter record by its associated request's ID.
func GetTRBAdviceLetterByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBAdviceLetter, error) {
	letter, err := store.GetTRBAdviceLetterByTRBRequestID(appcontext.ZLogger(ctx), id)

	if err != nil {
		return nil, err
	}

	if letter == nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB advice letter",
			zap.Error(err),
			zap.String("trbRequestID", id.String()),
		)

		return nil, &apperrors.ResourceNotFoundError{
			Err:      err,
			Resource: models.TRBAdviceLetter{},
		}
	}

	return letter, nil
}

// CreateTRBAdviceLetter creates an advice letter for a TRB request, in the "In Progress" status, when the advice letter is ready to be worked on.
func CreateTRBAdviceLetter(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBAdviceLetter, error) {
	letter, err := store.CreateTRBAdviceLetter(appcontext.ZLogger(ctx), appcontext.Principal(ctx).ID(), trbRequestID)
	if err != nil {
		return nil, err
	}

	return letter, nil
}

// UpdateTRBAdviceLetter handles general updates to a TRB advice letter
func UpdateTRBAdviceLetter(ctx context.Context, store *storage.Store, input map[string]interface{}) (*models.TRBAdviceLetter, error) {
	logger := appcontext.ZLogger(ctx)

	trbRequestIDStr, idFound := input["trbRequestId"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
	}

	trbRequestID, err := uuid.Parse(trbRequestIDStr.(string))
	if err != nil {
		return nil, err
	}

	letter, err := store.GetTRBAdviceLetterByTRBRequestID(logger, trbRequestID)
	if err != nil {
		return nil, err
	}

	err = ApplyChangesAndMetaData(input, letter, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updatedLetter, err := store.UpdateTRBAdviceLetter(logger, letter)
	if err != nil {
		return nil, err
	}

	return updatedLetter, err
}

// RequestReviewForTRBAdviceLetter sets a TRB advice letter as ready for review and (TODO) notifies the given recipients.
func RequestReviewForTRBAdviceLetter(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBAdviceLetter, error) {
	// TODO - EASI-2514 - send notification email(s)

	letter, err := store.UpdateTRBAdviceLetterStatus(appcontext.ZLogger(ctx), id, models.TRBAdviceLetterStatusReadyForReview)
	if err != nil {
		return nil, err
	}

	return letter, nil
}

// SendTRBAdviceLetter sends a TRB advice letter, setting its DateSent field, and (TODO) notifies the given recipients.
func SendTRBAdviceLetter(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBAdviceLetter, error) {
	// TODO - EASI-2515 - send notification email(s)

	letter, err := store.UpdateTRBAdviceLetterStatus(appcontext.ZLogger(ctx), id, models.TRBAdviceLetterStatusCompleted)
	if err != nil {
		return nil, err
	}

	return letter, nil
}
