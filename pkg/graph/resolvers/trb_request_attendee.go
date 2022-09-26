package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBRequestAttendee creates a TRBRequestAttendee in the database
func CreateTRBRequestAttendee(ctx context.Context, store *storage.Store, attendee *models.TRBRequestAttendee) (*models.TRBRequestAttendee, error) {
	attendee.CreatedBy = appcontext.Principal(ctx).ID()
	createdAttendee, err := store.CreateTRBRequestAttendee(ctx, attendee)
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
func GetTRBRequestAttendeesByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.TRBRequestAttendee, error) {
	attendees, err := store.GetTRBRequestAttendeesByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	return attendees, err
}
