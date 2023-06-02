package resolvers

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// GetTRBAdviceLetterByTRBRequestID fetches a TRB advice letter record by its associated request's ID.
func GetTRBAdviceLetterByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBAdviceLetter, error) {
	return store.GetTRBAdviceLetterByTRBRequestID(ctx, id)
}

// CreateTRBAdviceLetter creates an advice letter for a TRB request, in the "In Progress" status, when the advice letter is ready to be worked on.
func CreateTRBAdviceLetter(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBAdviceLetter, error) {
	letter, err := store.CreateTRBAdviceLetter(ctx, appcontext.Principal(ctx).ID(), trbRequestID)
	if err != nil {
		return nil, err
	}

	return letter, nil
}

// UpdateTRBAdviceLetter handles general updates to a TRB advice letter
func UpdateTRBAdviceLetter(ctx context.Context, store *storage.Store, input map[string]interface{}) (*models.TRBAdviceLetter, error) {
	trbRequestIDStr, idFound := input["trbRequestId"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
	}

	trbRequestID, err := uuid.Parse(trbRequestIDStr.(string))
	if err != nil {
		return nil, err
	}

	letter, err := store.GetTRBAdviceLetterByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}

	err = ApplyChangesAndMetaData(input, letter, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updatedLetter, err := store.UpdateTRBAdviceLetter(ctx, letter)
	if err != nil {
		return nil, err
	}

	return updatedLetter, err
}

// RequestReviewForTRBAdviceLetter sets a TRB advice letter as ready for review and notifies the given recipients.
func RequestReviewForTRBAdviceLetter(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	id uuid.UUID,
) (*models.TRBAdviceLetter, error) {
	letter, err := store.UpdateTRBAdviceLetterStatus(ctx, id, models.TRBAdviceLetterStatusReadyForReview)
	if err != nil {
		return nil, err
	}

	trb, err := store.GetTRBRequestByID(ctx, letter.TRBRequestID)
	if err != nil {
		return nil, err
	}

	requesterInfo, err := fetchUserInfo(ctx, trb.GetCreatedBy())
	if err != nil {
		return nil, err
	}

	var leadName string
	if trb.TRBLead != nil {
		leadInfo, err2 := fetchUserInfo(ctx, *trb.TRBLead)
		if err2 != nil {
			return nil, err2
		}
		leadName = leadInfo.CommonName
	}

	emailInput := email.SendTRBAdviceLetterInternalReviewEmailInput{
		TRBRequestID:   trb.ID,
		TRBRequestName: trb.GetName(),
		TRBLeadName:    leadName,
		RequesterName:  requesterInfo.CommonName,
	}

	// Email client can be nil when this is called from tests - the email client itself tests this
	// separately in the email package test
	if emailClient != nil {
		err = emailClient.SendTRBAdviceLetterInternalReviewEmail(ctx, emailInput)
		if err != nil {
			return nil, err
		}
	}

	return letter, nil
}

// SendTRBAdviceLetter sends a TRB advice letter, setting its DateSent field, and (TODO) notifies the given recipients.
func SendTRBAdviceLetter(ctx context.Context,
	store *storage.Store,
	id uuid.UUID,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
) (*models.TRBAdviceLetter, error) {
	letter, err := store.UpdateTRBAdviceLetterStatus(ctx, id, models.TRBAdviceLetterStatusCompleted)
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

	// Query the TRB request attendees
	var attendees []*models.TRBRequestAttendee
	var errAttendees error
	errGroup.Go(func() error {
		attendees, errAttendees = store.GetTRBRequestAttendeesByTRBRequestID(ctx, trbID)
		return errAttendees
	})

	if errG := errGroup.Wait(); errG != nil {
		return nil, errG
	}

	requester, err := fetchUserInfo(ctx, trb.CreatedBy)
	if err != nil {
		return nil, err
	}

	recipientEuas := make([]string, 0, len(attendees))
	for _, attendee := range attendees {
		recipientEuas = append(recipientEuas, attendee.EUAUserID)
	}

	attendeeInfos, err := fetchUserInfos(ctx, recipientEuas)
	if err != nil {
		return nil, err
	}

	recipientEmails := make([]models.EmailAddress, 0, len(attendees)+1)
	for _, attendeeInfo := range attendeeInfos {
		recipientEmails = append(recipientEmails, attendeeInfo.Email)
	}
	recipientEmails = append(recipientEmails, requester.Email)

	var component string
	if form.Component != nil {
		component = *form.Component
	}

	emailInput := email.SendTRBAdviceLetterSubmittedEmailInput{
		TRBRequestID:   trb.ID,
		RequestName:    trb.GetName(),
		RequestType:    string(trb.Type),
		RequesterName:  requester.CommonName,
		Component:      component,
		SubmissionDate: letter.ModifiedAt,
		ConsultDate:    trb.ConsultMeetingTime,
		Recipients:     recipientEmails,
	}

	// Email client can be nil when this is called from tests - the email client itself tests this
	// separately in the email package test
	if emailClient != nil {
		err = emailClient.SendTRBAdviceLetterSubmittedEmail(ctx, emailInput)
		if err != nil {
			return nil, err
		}
	}
	return letter, nil
}
