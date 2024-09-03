package resolvers

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// CreateTRBRequest makes a new TRB request
func CreateTRBRequest(
	ctx context.Context,
	requestType models.TRBRequestType,
	store *storage.Store,
) (*models.TRBRequest, error) {
	return sqlutils.WithTransactionRet[*models.TRBRequest](ctx, store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		princ := appcontext.Principal(ctx)

		trb := models.NewTRBRequest(princ.ID())
		trb.Type = requestType
		trb.State = models.TRBRequestStateOpen
		createdTRB, err := store.CreateTRBRequest(ctx, tx, trb)
		if err != nil {
			return nil, err
		}
		form := models.NewTRBRequestForm(princ.ID())
		form.TRBRequestID = createdTRB.ID

		// Create request form
		_, err = store.CreateTRBRequestForm(ctx, tx, form)
		if err != nil {
			return nil, fmt.Errorf(" unable to create  to create TRB request err :%w", err)
		}

		// Add requester as an attendee
		initialAttendee := &models.TRBRequestAttendee{
			TRBRequestID: createdTRB.ID,
			EUAUserID:    princ.ID(),
			Component:    nil,
			Role:         nil,
		}
		initialAttendee.CreatedBy = princ.ID()
		_, err = store.CreateTRBRequestAttendee(ctx, tx, initialAttendee)
		if err != nil {
			return nil, err
		}

		return createdTRB, err

	})
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
func GetTRBRequestByID(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequest, error) {
	return store.GetTRBRequestByID(ctx, id)
}

// GetTRBRequests returns all TRB Requests
func GetTRBRequests(ctx context.Context, store *storage.Store, archived bool) ([]*models.TRBRequest, error) {
	return store.GetTRBRequests(ctx, archived)
}

// GetMyTRBRequests returns all TRB Requests that belong to the principal in the context
func GetMyTRBRequests(ctx context.Context, store *storage.Store, archived bool) ([]*models.TRBRequest, error) {
	return store.GetMyTRBRequests(ctx, archived)
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
		RequesterName:      requesterInfo.DisplayName,
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
		TRBLeadName:    leadInfo.DisplayName,
		RequesterName:  requesterInfo.DisplayName,
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
	reasonClosed models.HTML,
	copyTRBMailbox bool,
	notifyEUAIDs []string,
) (*models.TRBRequest, error) {
	trb, err := store.GetTRBRequestByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Check if request is already closed so an unnecesary email won't be sent
	if trb.State != models.TRBRequestStateOpen {
		return nil, errors.New("cannot close a TRB request that is not open")
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
		RequesterName:  requester.DisplayName,
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
	reasonReopened models.HTML,
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
		return nil, errors.New("cannot re-open a TRB request that is not closed")
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
		RequesterName:  requester.DisplayName,
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
		info, err := dataloaders.FetchUserInfoByEUAUserID(ctx, *trbLead)
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
	requesterInfo, err := dataloaders.FetchUserInfoByEUAUserID(ctx, requesterEUA)
	if err != nil {
		return nil, err
	}

	if requesterInfo == nil {
		requesterInfo = &models.UserInfo{}
	}

	return requesterInfo, nil
}
