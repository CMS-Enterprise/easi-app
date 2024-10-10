package resolvers

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// GetTRBGuidanceLetterByTRBRequestID fetches a TRB guidance letter record by its associated request's ID.
func GetTRBGuidanceLetterByTRBRequestID(ctx context.Context, id uuid.UUID) (*models.TRBGuidanceLetter, error) {
	return dataloaders.GetTRBGuidanceLetterByTRBRequestID(ctx, id)
}

// CreateTRBGuidanceLetter creates a guidance letter for a TRB request, in the "In Progress" status, when the guidance letter is ready to be worked on.
func CreateTRBGuidanceLetter(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBGuidanceLetter, error) {
	letter, err := store.CreateTRBGuidanceLetter(ctx, appcontext.Principal(ctx).ID(), trbRequestID)
	if err != nil {
		return nil, err
	}

	return letter, nil
}

// UpdateTRBGuidanceLetter handles general updates to a TRB guidance letter
func UpdateTRBGuidanceLetter(ctx context.Context, store *storage.Store, input map[string]interface{}) (*models.TRBGuidanceLetter, error) {
	idIface, idFound := input["trbRequestId"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
	}

	id, ok := idIface.(uuid.UUID)
	if !ok {
		return nil, fmt.Errorf("unable to convert incoming trbRequestId to uuid when updating TRB guidance letter: %v", idIface)
	}

	letter, err := store.GetTRBGuidanceLetterByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	err = ApplyChangesAndMetaData(input, letter, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updatedLetter, err := store.UpdateTRBGuidanceLetter(ctx, letter)
	if err != nil {
		return nil, err
	}

	return updatedLetter, err
}

// RequestReviewForTRBGuidanceLetter sets a TRB guidance letter as ready for review and notifies the given recipients.
func RequestReviewForTRBGuidanceLetter(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	id uuid.UUID,
) (*models.TRBGuidanceLetter, error) {
	letter, err := store.UpdateTRBGuidanceLetterStatus(ctx, id, models.TRBGuidanceLetterStatusReadyForReview)
	if err != nil {
		return nil, err
	}

	trb, err := store.GetTRBRequestByID(ctx, letter.TRBRequestID)
	if err != nil {
		return nil, err
	}

	var leadName string
	if trb.TRBLead != nil {
		leadInfo, err2 := fetchUserInfo(ctx, *trb.TRBLead)
		if err2 != nil {
			return nil, err2
		}
		leadName = leadInfo.DisplayName
	}

	emailInput := email.SendTRBGuidanceLetterInternalReviewEmailInput{
		TRBRequestID:   trb.ID,
		TRBRequestName: trb.GetName(),
		TRBLeadName:    leadName,
	}

	// Email client can be nil when this is called from tests - the email client itself tests this
	// separately in the email package test
	if emailClient != nil {
		err = emailClient.SendTRBGuidanceLetterInternalReviewEmail(ctx, emailInput)
		if err != nil {
			return nil, err
		}
	}

	return letter, nil
}

// SendTRBGuidanceLetter sends a TRB guidance letter, setting its DateSent field, and (TODO) notifies the given recipients.
func SendTRBGuidanceLetter(ctx context.Context,
	store *storage.Store,
	id uuid.UUID,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
	copyTRBMailbox bool,
	notifyEUAIDs []string,
) (*models.TRBGuidanceLetter, error) {
	// Fetch user info for each EUA ID we want to notify
	notifyUserInfos, err := fetchUserInfos(ctx, notifyEUAIDs)
	if err != nil {
		return nil, err
	}

	letter, err := store.UpdateTRBGuidanceLetterStatus(ctx, id, models.TRBGuidanceLetterStatusCompleted)
	if err != nil {
		return nil, err
	}

	trbID := letter.TRBRequestID

	// Query the TRB request, form, attendees in parallel
	errGroup := new(errgroup.Group)

	// Query the TRB request
	var trb *models.TRBRequest
	var errTRB error
	errGroup.Go(func() error {
		trb, errTRB = store.GetTRBRequestByID(ctx, trbID)
		return errTRB
	})

	// Query the TRB form
	var form *models.TRBRequestForm
	var errForm error
	errGroup.Go(func() error {
		form, errForm = store.GetTRBRequestFormByTRBRequestID(ctx, trbID)
		return errForm
	})

	if errG := errGroup.Wait(); errG != nil {
		return nil, errG
	}

	requester, err := fetchUserInfo(ctx, trb.CreatedBy)
	if err != nil {
		return nil, err
	}

	recipientEmails := make([]models.EmailAddress, 0, len(notifyUserInfos))
	for _, recipientInfo := range notifyUserInfos {
		recipientEmails = append(recipientEmails, recipientInfo.Email)
	}

	var component string
	if form.Component != nil {
		component = *form.Component
	}

	emailInput := email.SendTRBGuidanceLetterSubmittedEmailInput{
		TRBRequestID:   trb.ID,
		RequestName:    trb.GetName(),
		RequestType:    string(trb.Type),
		RequesterName:  requester.DisplayName,
		Component:      component,
		SubmissionDate: letter.ModifiedAt,
		ConsultDate:    trb.ConsultMeetingTime,
		CopyTRBMailbox: copyTRBMailbox,
		Recipients:     recipientEmails,
	}

	// Email client can be nil when this is called from tests - the email client itself tests this
	// separately in the email package test
	if emailClient != nil {
		err = emailClient.SendTRBGuidanceLetterSubmittedEmail(ctx, emailInput)
		if err != nil {
			return nil, err
		}
	}
	return letter, nil
}
