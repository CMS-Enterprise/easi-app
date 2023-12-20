package models

import (
	"context"

	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
)

// modifiedByRelation is a struct meant to be embedded to show that the object has created_by and created_dts fields, as well as
// shared logic to get the user account represented by the created_by uuid
type modifiedByRelation struct {
	ModifiedBy *uuid.UUID `json:"modifiedBy" db:"modified_by"`
	ModifiedAt *time.Time `json:"modifiedAt" db:"modified_at"`
}

// ModifiedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (mbr *modifiedByRelation) ModifiedByUserAccount(ctx context.Context) *authentication.UserAccount {

	if mbr.ModifiedBy == nil {
		return nil
	}
	service := appcontext.UserAccountService(ctx)
	account, _ := service(ctx, *mbr.ModifiedBy)
	return account

}
