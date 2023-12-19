package models

import (
	"context"

	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
)

// CreatedByRelation is a struct meant to be embedded to show that the object has created_by and created_dts fields, as well as
// shared logic to get the user account represented by the created_by uuid
type createdByRelation struct {
	CreatedBy  uuid.UUID `json:"createdBy" db:"created_by"`
	CreatedDts time.Time `json:"createdDts" db:"created_dts"`
}

// CreatedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (cbr *createdByRelation) CreatedByUserAccount(ctx context.Context) *authentication.UserAccount {

	service := appcontext.UserAccountService(ctx)
	account, _ := service(ctx, cbr.CreatedBy)
	return account

}
