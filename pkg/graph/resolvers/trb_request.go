package resolvers

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBRequest makes a new TRB request
func CreateTRBRequest(ctx context.Context, requestType models.TRBRequestType, fetchUserInfo func(context.Context, string) (*models.UserInfo, error), store *storage.Store) (*models.TRBRequest, error) {
	princ := appcontext.Principal(ctx)

	// Fetch user info for the "requester" attendee
	requester, err := fetchUserInfo(ctx, princ.ID())
	if err != nil {
		return nil, err
	}

	trb := models.NewTRBRequest(princ.ID())
	trb.Type = requestType
	trb.Status = models.TRBSOpen
	//TODO make sure this is wired up appropriately

	createdTRB, err := store.CreateTRBRequest(ctx, trb)
	if err != nil {
		return nil, err
	}

	// This should probably be a part of a transaction...
	initialAttendee := &models.TRBRequestAttendee{
		TRBRequestID: createdTRB.ID,
		EUAUserID:    requester.EuaUserID,
		Component:    nil,
		Role:         nil,
	}
	initialAttendee.CreatedBy = appcontext.Principal(ctx).ID()
	_, err = store.CreateTRBRequestAttendee(ctx, initialAttendee)
	if err != nil {
		return nil, err
	}

	//TODO create place holders for the rest of the related sections with calls to their stores

	return createdTRB, err
}

// UpdateTRBRequest updates a TRB request
func UpdateTRBRequest(ctx context.Context, id uuid.UUID, changes map[string]interface{}, store *storage.Store) (*models.TRBRequest, error) {
	existing, err := store.GetTRBRequestByID(ctx, id)
	if err != nil {
		return nil, err
	}

	princ := appcontext.Principal(ctx)

	//apply changes here
	err = ApplyChangesAndMetaData(changes, existing, princ)
	if err != nil {
		return nil, err
	}

	retTRB, err := store.UpdateTRBRequest(ctx, existing)
	if err != nil {
		return nil, err
	}

	return retTRB, err
}

// GetTRBRequestByID returns a TRB request by it's ID
func GetTRBRequestByID(ctx context.Context, id uuid.UUID, store *storage.Store) (*models.TRBRequest, error) {
	trb, err := store.GetTRBRequestByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return trb, err
}

// GetTRBRequests returns all TRB Requests
func GetTRBRequests(ctx context.Context, archived bool, store *storage.Store) ([]*models.TRBRequest, error) {
	TRBRequests, err := store.GetTRBRequests(ctx, archived)
	if err != nil {
		return nil, err
	}
	return TRBRequests, err
}

// UpdateTRBRequestConsultMeetingTime sets the TRB consult meeting time and sends the related emails
func UpdateTRBRequestConsultMeetingTime(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
	id uuid.UUID,
	meetingTime time.Time,
	copyTRBMailbox bool,
	notifyEUAIDs []string,
	notes string,
) (*models.TRBRequest, error) {
	notifyEmails := []models.EmailAddress{}
	if len(notifyEUAIDs) > 0 {
		notifyInfos, err := fetchUserInfos(ctx, notifyEUAIDs)
		if err != nil {
			return nil, err
		}
		for _, info := range notifyInfos {
			if info != nil {
				notifyEmails = append(notifyEmails, models.NewEmailAddress(info.Email.String()))
			}
		}
	}

	trb, err := store.GetTRBRequestByID(ctx, id)
	if err != nil {
		return nil, err
	}

	requesterInfo, err := fetchUserInfo(ctx, trb.GetCreatedBy())
	if err != nil {
		return nil, err
	}

	changes := map[string]interface{}{
		"consultMeetingTime": &meetingTime,
	}
	err = ApplyChangesAndMetaData(changes, trb, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updatedTrb, err := store.UpdateTRBRequest(ctx, trb)
	if err != nil {
		return nil, err
	}

	emailInput := email.SendTRBRequestConsultMeetingEmailInput{
		TRBRequestID:       trb.ID,
		TRBRequestName:     trb.Name,
		ConsultMeetingTime: meetingTime,
		CopyTRBMailbox:     copyTRBMailbox,
		NotifyEmails:       notifyEmails,
		Notes:              notes,
		RequesterName:      requesterInfo.CommonName,
	}

	// Email client can be nil when this is called from tests - the email client itself tests this
	// separately in the email package test
	if emailClient != nil {
		err = emailClient.SendTRBRequestConsultMeetingEmail(ctx, emailInput)
		if err != nil {
			return nil, err
		}
	}

	return updatedTrb, err
}

// UpdateTRBRequestTRBLead sets the TRB lead and sends the related emails
func UpdateTRBRequestTRBLead(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	id uuid.UUID,
	trbLead string,
) (*models.TRBRequest, error) {
	trb, err := store.GetTRBRequestByID(ctx, id)
	if err != nil {
		return nil, err
	}

	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	requesterInfo, err := fetchUserInfo(ctx, trb.GetCreatedBy())
	if err != nil {
		return nil, err
	}

	leadInfo, err := fetchUserInfo(ctx, trbLead)
	if err != nil {
		return nil, err
	}

	changes := map[string]interface{}{
		"trbLead": &trbLead,
	}

	err = ApplyChangesAndMetaData(changes, trb, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updatedTrb, err := store.UpdateTRBRequest(ctx, trb)
	if err != nil {
		return nil, err
	}

	component := ""
	if form.Component != nil {
		component = *form.Component
	}

	emailInput := email.SendTRBRequestTRBLeadEmailInput{
		TRBRequestID:   trb.ID,
		TRBRequestName: trb.Name,
		TRBLeadName:    leadInfo.CommonName,
		RequesterName:  requesterInfo.CommonName,
		Component:      component,
		TRBLeadEmail:   leadInfo.Email,
	}

	// Email client can be nil when this is called from tests - the email client itself tests this
	// separately in the email package test
	if emailClient != nil {
		err = emailClient.SendTRBRequestTRBLeadAssignedEmails(ctx, emailInput)
		if err != nil {
			return nil, err
		}
	}

	return updatedTrb, err
}

// CloseTRBRequest closes a TRB request and sends an email if recipients are specified
func CloseTRBRequest(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
	id uuid.UUID,
	reasonClosed string,
	notifyEUAIDs []string,
) (*models.TRBRequest, error) {
	trb, err := store.GetTRBRequestByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Check if request is already closed so an unnecesary email won't be sent
	if trb.Status != models.TRBSOpen {
		return nil, errors.New("Cannot close a TRB request that is not open")
	}

	trbChanges := map[string]interface{}{
		"status": models.TRBSClosed,
	}

	err = ApplyChangesAndMetaData(trbChanges, trb, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updatedTrb, err := store.UpdateTRBRequest(ctx, trb)
	if err != nil {
		return nil, err
	}

	requester, err := fetchUserInfo(ctx, trb.CreatedBy)
	if err != nil {
		return nil, err
	}

	notifyUserInfos, err := fetchUserInfos(ctx, notifyEUAIDs)
	if err != nil {
		return nil, err
	}

	recipientEmails := make([]models.EmailAddress, 0, len(notifyUserInfos)+1)
	for _, recipientInfo := range notifyUserInfos {
		recipientEmails = append(recipientEmails, recipientInfo.Email)
	}
	recipientEmails = append(recipientEmails, requester.Email)

	emailInput := email.SendTRBRequestClosedEmailInput{
		TRBRequestID:   trb.ID,
		TRBRequestName: trb.Name,
		RequesterName:  requester.CommonName,
		Recipients:     recipientEmails,
		ReasonClosed:   reasonClosed,
	}

	// Email client can be nil when this is called from tests - the email client itself tests this
	// separately in the email package test
	if emailClient != nil {
		err = emailClient.SendTRBRequestClosedEmail(ctx, emailInput)
		if err != nil {
			return updatedTrb, err
		}
	}

	return updatedTrb, nil
}

// ReopenTRBRequest re-opens a TRB request and sends an email to the requester and attendees
func ReopenTRBRequest(
	ctx context.Context,
	store *storage.Store,
	id uuid.UUID,
	reasonReopened string,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
) (*models.TRBRequest, error) {
	// Query the TRB request, attendees in parallel
	errGroup := new(errgroup.Group)

	// Query the TRB request
	var trb *models.TRBRequest
	var errTRB error
	errGroup.Go(func() error {
		trb, errTRB = store.GetTRBRequestByID(ctx, id)
		return errTRB
	})

	// Query the TRB request attendees
	var attendees []*models.TRBRequestAttendee
	var errAttendees error
	errGroup.Go(func() error {
		attendees, errAttendees = store.GetTRBRequestAttendeesByTRBRequestID(ctx, id)
		return errAttendees
	})

	if errG := errGroup.Wait(); errG != nil {
		return nil, errG
	}

	// Check if request is already open so an unnecesary email won't be sent
	if trb.Status != models.TRBSClosed {
		return nil, errors.New("Cannot re-open a TRB request that is not closed")
	}

	trbChanges := map[string]interface{}{
		"status": models.TRBSOpen,
	}

	err := ApplyChangesAndMetaData(trbChanges, trb, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updatedTrb, err := store.UpdateTRBRequest(ctx, trb)
	if err != nil {
		return nil, err
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

	emailInput := email.SendTRBRequestReopenedEmailInput{
		TRBRequestID:   trb.ID,
		TRBRequestName: trb.Name,
		RequesterName:  requester.CommonName,
		Recipients:     recipientEmails,
		ReasonReopened: reasonReopened,
	}

	// Email client can be nil when this is called from tests - the email client itself tests this
	// separately in the email package test
	if emailClient != nil {
		err = emailClient.SendTRBRequestReopenedEmail(ctx, emailInput)
		if err != nil {
			return updatedTrb, err
		}
	}

	return updatedTrb, nil
}

// IsRecentTRBRequest determines if a TRB Request should be determined to be flagged as "recent" or not.
// TODO: Add more logic in https://jiraent.cms.gov/browse/EASI-2711
func IsRecentTRBRequest(ctx context.Context, obj *models.TRBRequest, now time.Time) bool {
	numDaysToConsiderRecent := -7
	recentIfAfterDate := now.AddDate(0, 0, numDaysToConsiderRecent)
	return obj.CreatedAt.After(recentIfAfterDate)
}
