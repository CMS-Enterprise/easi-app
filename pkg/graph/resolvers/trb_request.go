package resolvers

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBRequest makes a new TRB request
func CreateTRBRequest(
	ctx context.Context,
	requestType models.TRBRequestType,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	store *storage.Store,
) (*models.TRBRequest, error) {
	princ := appcontext.Principal(ctx)

	// Fetch user info for the "requester" attendee
	requester, err := fetchUserInfo(ctx, princ.ID())
	if err != nil {
		return nil, err
	}

	trb := models.NewTRBRequest(princ.ID())
	trb.Type = requestType
	trb.State = models.TRBRequestStateOpen

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

// GetMyTRBRequests returns all TRB Requests that belong to the principal in the context
func GetMyTRBRequests(ctx context.Context, archived bool, store *storage.Store) ([]*models.TRBRequest, error) {
	TRBRequests, err := store.GetMyTRBRequests(ctx, archived)
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
	notifyInfos, err := fetchUserInfos(ctx, notifyEUAIDs)
	if err != nil {
		return nil, err
	}
	for _, info := range notifyInfos {
		if info != nil {
			notifyEmails = append(notifyEmails, models.NewEmailAddress(info.Email.String()))
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
		TRBRequestName:     trb.GetName(),
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
		TRBRequestName: trb.GetName(),
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
	copyTRBMailbox bool,
	notifyEUAIDs []string,
) (*models.TRBRequest, error) {
	trb, err := store.GetTRBRequestByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Check if request is already closed so an unnecesary email won't be sent
	if trb.State != models.TRBRequestStateOpen {
		return nil, errors.New("Cannot close a TRB request that is not open")
	}

	trbChanges := map[string]interface{}{
		"state": models.TRBRequestStateClosed,
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

	recipientEmails := make([]models.EmailAddress, 0, len(notifyUserInfos))
	for _, recipientInfo := range notifyUserInfos {
		recipientEmails = append(recipientEmails, recipientInfo.Email)
	}

	emailInput := email.SendTRBRequestClosedEmailInput{
		TRBRequestID:   trb.ID,
		TRBRequestName: trb.GetName(),
		RequesterName:  requester.CommonName,
		Recipients:     recipientEmails,
		CopyTRBMailbox: copyTRBMailbox,
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
	copyTRBMailbox bool,
	notifyEUAIDs []string,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
) (*models.TRBRequest, error) {
	// Query the TRB request
	trb, err := store.GetTRBRequestByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Check if request is already open so an unnecesary email won't be sent
	if trb.State != models.TRBRequestStateClosed {
		return nil, errors.New("Cannot re-open a TRB request that is not closed")
	}

	trbChanges := map[string]interface{}{
		"state": models.TRBRequestStateOpen,
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

	recipientEmails := make([]models.EmailAddress, 0, len(notifyUserInfos))
	for _, recipientInfo := range notifyUserInfos {
		recipientEmails = append(recipientEmails, recipientInfo.Email)
	}

	emailInput := email.SendTRBRequestReopenedEmailInput{
		TRBRequestID:   trb.ID,
		TRBRequestName: trb.GetName(),
		RequesterName:  requester.CommonName,
		Recipients:     recipientEmails,
		ReasonReopened: reasonReopened,
		CopyTRBMailbox: copyTRBMailbox,
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
func IsRecentTRBRequest(ctx context.Context, obj *models.TRBRequest, now time.Time) bool {
	numDaysToConsiderRecent := -7
	recencyDate := now.AddDate(0, 0, numDaysToConsiderRecent)
	isRequestClosed := obj.State == models.TRBRequestStateClosed
	hasNoLeadAssigned := obj.TRBLead == nil

	// A request is only recent if it's not closed
	// A request is only recent if it's either created after the recencyDate OR has no lead assigned
	isRecent := !isRequestClosed && (obj.CreatedAt.After(recencyDate) || hasNoLeadAssigned)
	return isRecent
}

// GetTRBLeadInfo retrieves the user info of a TRB request's lead
func GetTRBLeadInfo(ctx context.Context, trbLead *string) (*models.UserInfo, error) {
	var trbLeadInfo *models.UserInfo
	if trbLead != nil {
		info, err := dataloaders.GetUserInfo(ctx, *trbLead)
		if err != nil {
			return nil, err
		}
		trbLeadInfo = info
	}

	if trbLeadInfo == nil {
		trbLeadInfo = &models.UserInfo{}
	}

	return trbLeadInfo, nil
}

// GetTRBRequesterInfo retrieves the user info of a TRB request's requester
func GetTRBRequesterInfo(ctx context.Context, requesterEUA string) (*models.UserInfo, error) {
	requesterInfo, err := dataloaders.GetUserInfo(ctx, requesterEUA)
	fmt.Println("REQUESTER INFO", requesterEUA, requesterInfo)
	if err != nil {
		return nil, err
	}

	if requesterInfo == nil {
		requesterInfo = &models.UserInfo{}
	}

	return requesterInfo, nil
}

// GetTRBUserComponent retrieves the component of a TRB user from the TRB attendees table
func GetTRBUserComponent(ctx context.Context, store *storage.Store, euaID *string, trbRequestID uuid.UUID) (*string, error) {
	// TODO/tech debt: This results in an N+1 problem and could be moved to a dataloader if
	// performance ever becomes an issue
	var component *string
	if euaID != nil {
		attendeeComponent, err := store.GetAttendeeComponentByEUA(ctx, *euaID, trbRequestID)
		if err != nil {
			return nil, err
		}
		component = attendeeComponent
	}
	return component, nil
}
