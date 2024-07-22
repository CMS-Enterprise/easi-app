package models

import (
	"context"
	"fmt"

	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

// CreatedByRelation is a struct meant to be embedded to show that the object has created_by and created_at fields, as well as
// shared logic to get the user account represented by the created_by uuid
type createdByRelation struct {
	CreatedBy uuid.UUID `json:"createdBy" db:"created_by"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

// CreatedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (cbr *createdByRelation) CreatedByUserAccount(ctx context.Context) (*authentication.UserAccount, error) {
	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get created by user account, there is an issue with the user account service. err %w", err)
	}
	account, err := service(ctx, cbr.CreatedBy)
	if err != nil {
		return nil, err
	}
	return account, nil
}
