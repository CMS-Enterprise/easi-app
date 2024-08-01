package resolvers

import (
	"context"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// CreateTRBRequestAttendee creates a TRBRequestAttendee in the database
func CreateTRBRequestAttendee(
	ctx context.Context,
	store *storage.Store,
	sendTRBAttendeeAddedNotification func(
		ctx context.Context,
		attendeeEmail models.EmailAddress,
		requestName string,
		requesterName string,
	) error,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	attendee *models.TRBRequestAttendee,
) (*models.TRBRequestAttendee, error) {
	// start fetching info we'll need to send notifications now, but don't wait on results until we're ready to send emails
	var request models.TRBRequest
	var requester models.UserInfo
	var attendeeInfo models.UserInfo

	emailInfoErrGroup := new(errgroup.Group)

	emailInfoErrGroup.Go(func() error {
		// declare new error variable so we don't interfere with calls outside of this goroutine
		requestPtr, getRequestErr := store.GetTRBRequestByID(ctx, attendee.TRBRequestID)
		if getRequestErr != nil {
			return getRequestErr
		}
		request = *requestPtr

		requesterPtr, getRequesterErr := fetchUserInfo(ctx, request.CreatedBy)
		if getRequesterErr != nil {
			return getRequesterErr
		}
		requester = *requesterPtr

		return nil
	})

	emailInfoErrGroup.Go(func() error {
		// declare new error variable so we don't interfere with calls outside of this goroutine
		attendeeInfoPtr, fetchUserInfoErr := fetchUserInfo(ctx, attendee.EUAUserID)
		if fetchUserInfoErr != nil {
			return fetchUserInfoErr
		}
		attendeeInfo = *attendeeInfoPtr
		return nil
	})

	attendee.CreatedBy = appcontext.Principal(ctx).ID()
	createdAttendee, err := store.CreateTRBRequestAttendee(ctx, store, attendee)
	if err != nil {
		return nil, err
	}

	// send notification email last; make sure database has been updated first

	if err = emailInfoErrGroup.Wait(); err != nil {
		return nil, err
	}

	// send email notification
	err = sendTRBAttendeeAddedNotification(
		ctx,
		attendeeInfo.Email,
		request.GetName(),
		requester.DisplayName,
	)
	if err != nil {
		return nil, err
	}

	return createdAttendee, nil
}

// UpdateTRBRequestAttendee updates a TRBRequestAttendee record in the database
func UpdateTRBRequestAttendee(ctx context.Context, store *storage.Store, attendee *models.TRBRequestAttendee) (*models.TRBRequestAttendee, error) {
	modifiedBy := appcontext.Principal(ctx).ID()
	attendee.ModifiedBy = &modifiedBy

	updatedAttendee, err := store.UpdateTRBRequestAttendee(ctx, attendee)
	if err != nil {
		return nil, err
	}

	return updatedAttendee, nil
}

// DeleteTRBRequestAttendee deletes a TRBRequestAttendee record from the database
func DeleteTRBRequestAttendee(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequestAttendee, error) {
	deleted, err := store.DeleteTRBRequestAttendee(ctx, id)
	if err != nil {
		return nil, err
	}
	return deleted, nil
}

// GetTRBRequestAttendeesByTRBRequestID retrieves a list of attendees associated with a TRB request
func GetTRBRequestAttendeesByTRBRequestID(ctx context.Context, id uuid.UUID) ([]*models.TRBRequestAttendee, error) {
	attendees, err := dataloaders.GetTRBAttendeesByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	return attendees, err
}

// GetTRBAttendeeComponent retrieves the component of a TRB user from the TRB attendees table
func GetTRBAttendeeComponent(ctx context.Context, euaID *string, trbRequestID uuid.UUID) (*string, error) {
	if euaID == nil {
		return nil, nil
	}
	attendee, err := dataloaders.GetTRBAttendeeByEUAIDAndTRBRequestID(ctx, *euaID, trbRequestID)
	if err != nil {
		return nil, err
	}
	return attendee.Component, nil
}
