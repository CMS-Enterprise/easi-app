package translation

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
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
func GetCoreTranslatableContactInfo(ctx context.Context, systemIntakeID uuid.UUID) (retContacts *CoreTranslatableContacts, err error) {
	contacts, err := resolvers.SystemIntakeContactsGetBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		return nil, fmt.Errorf("error getting contact information for system intake %s: %w", systemIntakeID.String(), err)
	}
	retContacts = &CoreTranslatableContacts{}

	requester, _ := contacts.Requester()
	if requester != nil {
		reqAccount, _ := requester.UserAccount(ctx)
		if reqAccount != nil {
			retContacts.Requester = reqAccount.Username
		}
		retContacts.Component = null.StringFrom(string(requester.Component))
	}
	businessOwners, _ := contacts.BusinessOwners()
	if len(businessOwners) > 0 {
		boAccount, _ := businessOwners[0].UserAccount(ctx)
		if boAccount != nil {
			retContacts.BusinessOwner = null.StringFrom(boAccount.Username)
		}
		retContacts.BusinessOwnerComponent = null.StringFrom(string(businessOwners[0].Component))
	}

	productManagers, _ := contacts.ProductManagers()
	if len(productManagers) > 0 {
		pmAccount, _ := productManagers[0].UserAccount(ctx)
		if pmAccount != nil {
			retContacts.ProductManager = null.StringFrom(pmAccount.Username)
		}
		retContacts.ProductManagerComponent = null.StringFrom(string(productManagers[0].Component))
	}
	return retContacts, nil
}
