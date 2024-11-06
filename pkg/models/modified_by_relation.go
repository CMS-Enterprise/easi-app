package models

import (
	"context"
	"fmt"

	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

// modifiedByRelation is a struct meant to be embedded to show that the object has modified_by and modified_at fields, as well as
// shared logic to get the user account represented by the modified_by uuid
type modifiedByRelation struct {
	ModifiedBy *uuid.UUID `json:"modifiedBy" db:"modified_by"`
	ModifiedAt *time.Time `json:"modifiedAt" db:"modified_at"`
}

// ModifiedByUserAccount returns the user account of the user who modified the struct from the DB using the UserAccount service
func (mbr *modifiedByRelation) ModifiedByUserAccount(ctx context.Context) (*authentication.UserAccount, error) {
	if mbr.ModifiedBy == nil {
		return nil, nil
	}
	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get modified by user account, there is an issue with the user account service. err %w", err)
	}
	account, err := service(ctx, *mbr.ModifiedBy)
	if err != nil {
		return nil, err
	}
	return account, nil
}
