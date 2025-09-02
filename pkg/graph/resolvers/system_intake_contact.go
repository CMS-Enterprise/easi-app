package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

// CreateSystemIntakeContact creates a system intake's contact info.
func CreateSystemIntakeContact(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	input models.CreateSystemIntakeContactInput,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.CreateSystemIntakeContactPayload, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	contactUserAccount, err := userhelpers.GetOrCreateUserAccount(ctx, store, store, input.EuaUserID, false, getAccountInformation)
	if err != nil {
		return nil, err
	}

	contact := models.NewSystemIntakeContact(contactUserAccount.ID, principalAccount.ID)
	contact.SystemIntakeID = input.SystemIntakeID
	contact.Component = input.Component
	contact.IsRequester = input.IsRequester

	contact.Roles = input.Roles

	createdContact, err := store.CreateSystemIntakeContact(ctx, contact)
	if err != nil {
		return nil, err
	}
	return &models.CreateSystemIntakeContactPayload{
		SystemIntakeContact: createdContact,
	}, nil
}

// SystemIntakeContactDelete will, delete a System Intake contact
func SystemIntakeContactDelete(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.SystemIntakeContact, error) {

	// TODO, consider expanding error handling, and make sure the delete returns the contact
	return store.DeleteSystemIntakeContact(ctx, id)

}

// UpdateSystemIntakeContact updates a system intake's contact info.
func UpdateSystemIntakeContact(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	input models.UpdateSystemIntakeContactInput,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.CreateSystemIntakeContactPayload, error) {
	// TODO: Fully implement this. This is a placeholder
	contact, err := store.GetSystemIntakeContactByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	contact.Component = input.Component
	contact.Roles = input.Roles
	contact.IsRequester = input.IsRequester
	err = BaseStructPreUpdate(map[string]any{}, contact, principal, false)
	if err != nil {
		return nil, err
	}

	updatedContact, err := store.UpdateSystemIntakeContact(ctx, contact)
	if err != nil {
		return nil, err
	}
	return &models.CreateSystemIntakeContactPayload{
		SystemIntakeContact: updatedContact,
	}, nil
}

// GetSystemIntakeContactsBySystemIntakeID fetches contacts for a system intake
func GetSystemIntakeContactsBySystemIntakeID(ctx context.Context, store *storage.Store, systemIntakeID uuid.UUID) (*models.SystemIntakeContacts, error) {
	//TODO: make this a data loader!
	contacts, err := store.FetchSystemIntakeContactsBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}
	// Wrap the returned type, so we can calculate additional information on it.
	return &models.SystemIntakeContacts{
		AllContacts: contacts,
	}, nil
}
