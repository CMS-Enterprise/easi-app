package translation

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// CoreTranslatableContacts holds the core contact information needed for translating a system intake contact for system intake
// and business case translation
type CoreTranslatableContacts struct {
	Requester               string
	Component               null.String
	BusinessOwner           null.String
	BusinessOwnerComponent  null.String
	ProductManager          null.String
	ProductManagerComponent null.String
}

// GetCoreTranslatableContactInfo returns the core contact information needed for translating a system intake contact for system intake
func GetCoreTranslatableContactInfo(ctx context.Context, systemIntakeID uuid.UUID) (*CoreTranslatableContacts, error) {
	contacts, err := resolvers.SystemIntakeContactsGetBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		return nil, fmt.Errorf("error getting contact information for system intake %s: %w", systemIntakeID.String(), err)
	}
	retContacts := &CoreTranslatableContacts{}

	requester := contacts.Requester()
	if requester != nil {
		requesterUsername, err := systemIntakeContactUsername(ctx, systemIntakeID, "requester", requester)
		if err != nil {
			return nil, err
		}
		if requesterUsername != nil {
			retContacts.Requester = *requesterUsername
		}
		retContacts.Component = null.StringFrom(string(requester.Component))
	}
	businessOwners := contacts.BusinessOwners()
	if len(businessOwners) > 0 {
		businessOwner := businessOwners[0]
		businessOwnerUsername, err := systemIntakeContactUsername(ctx, systemIntakeID, "business owner", businessOwner)
		if err != nil {
			return nil, err
		}
		if businessOwnerUsername != nil {
			retContacts.BusinessOwner = null.StringFrom(*businessOwnerUsername)
		}
		retContacts.BusinessOwnerComponent = null.StringFrom(string(businessOwner.Component))
	}

	productManagers := contacts.ProductManagers()
	if len(productManagers) > 0 {
		productManager := productManagers[0]
		productManagerUsername, err := systemIntakeContactUsername(ctx, systemIntakeID, "product manager", productManager)
		if err != nil {
			return nil, err
		}
		if productManagerUsername != nil {
			retContacts.ProductManager = null.StringFrom(*productManagerUsername)
		}
		retContacts.ProductManagerComponent = null.StringFrom(string(productManager.Component))
	}
	return retContacts, nil
}

func systemIntakeContactUsername(ctx context.Context, systemIntakeID uuid.UUID, label string, contact *models.SystemIntakeContact) (*string, error) {
	if contact == nil {
		return nil, nil
	}

	account, err := contact.UserAccount(ctx)
	if err != nil {
		return nil, fmt.Errorf("error getting %[1]s user account for system intake %[2]s: %[3]w", label, systemIntakeID.String(), err)
	}
	if account == nil {
		return nil, nil
	}

	return &account.Username, nil
}
