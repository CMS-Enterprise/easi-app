package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBRequest makes a new TRB request
func CreateTRBRequest(ctx context.Context, requestType models.TRBRequestType, store *storage.Store) (*models.TRBRequest, error) {
	princ := appcontext.Principal(ctx)
	trb := models.NewTRBRequest(princ.ID())
	trb.Type = requestType
	trb.Status = models.TRBSOpen
	//TODO make sure this is wired up appropriately

	createdTRB, err := store.CreateTRBRequest(appcontext.ZLogger(ctx), trb)
	if err != nil {
		return nil, err
	}

	//TODO create place holders for the rest of the related sections with calls to their stores

	return createdTRB, err
}

// UpdateTRBRequest updates a TRB request
func UpdateTRBRequest(ctx context.Context, id uuid.UUID, changes map[string]interface{}, store *storage.Store) (*models.TRBRequest, error) {
	existing, err := store.GetTRBRequestByID(appcontext.ZLogger(ctx), id)
	if err != nil {
		return nil, err
	}

	princ := appcontext.Principal(ctx)

	//apply changes here
	err = ApplyChangesAndMetaData(changes, existing, princ)
	if err != nil {
		return nil, err
	}

	retTRB, err := store.UpdateTRBRequest(appcontext.ZLogger(ctx), existing)
	if err != nil {
		return nil, err
	}

	return retTRB, err
}

// GetTRBRequestByID returns a TRB request by it's ID
func GetTRBRequestByID(ctx context.Context, id uuid.UUID, store *storage.Store) (*models.TRBRequest, error) {
	trb, err := store.GetTRBRequestByID(appcontext.ZLogger(ctx), id)
	if err != nil {
		return nil, err
	}

	return trb, err
}

// GetTRBRequests returns all TRB Requests
func GetTRBRequests(ctx context.Context, archived bool, store *storage.Store) ([]*models.TRBRequest, error) {
	TRBRequests, err := store.GetTRBRequests(appcontext.ZLogger(ctx), archived)
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
	notifyInfos, err := fetchUserInfos(ctx, notifyEUAIDs)
	if err != nil {
		return nil, err
	}
	notifyEmails := []models.EmailAddress{}
	for _, info := range notifyInfos {
		if info != nil {
			notifyEmails = append(notifyEmails, models.NewEmailAddress(info.Email.String()))
		}
	}

	trb, err := store.GetTRBRequestByID(appcontext.ZLogger(ctx), id)
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

	updatedTrb, err := store.UpdateTRBRequest(appcontext.ZLogger(ctx), trb)
	if err != nil {
		return nil, err
	}

	emailInput := email.SendTRBRequestConsultMeetingEmailInput{
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
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
	id uuid.UUID,
	trbLead string,
) (*models.TRBRequest, error) {
	trb, err := store.GetTRBRequestByID(appcontext.ZLogger(ctx), id)
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

	updatedTrb, err := store.UpdateTRBRequest(appcontext.ZLogger(ctx), trb)
	if err != nil {
		return nil, err
	}

	emailInput := email.SendTRBRequestTRBLeadEmailInput{
		TRBRequestName: trb.Name,
		TRBLeadName:    leadInfo.CommonName,
		RequesterName:  requesterInfo.CommonName,
	}

	// Email client can be nil when this is called from tests - the email client itself tests this
	// separately in the email package test
	if emailClient != nil {
		err = emailClient.SendTRBRequestTRBLeadEmail(ctx, emailInput)
		if err != nil {
			return nil, err
		}
	}

	return updatedTrb, err
}
