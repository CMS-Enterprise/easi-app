package models

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

type userIDRelation struct {
	UserID uuid.UUID `json:"userID" db:"user_id"`
}

// NewUserIDRelation returns a user ID relation object
func NewUserIDRelation(userID uuid.UUID) userIDRelation {
	return userIDRelation{
		UserID: userID,
	}
}

func (b *userIDRelation) UserAccount(ctx context.Context) (*authentication.UserAccount, error) {
	service := appcontext.UserAccountService(ctx)
	account, err := service(ctx, b.UserID)
	if err != nil {
		return nil, err
	}
	return account, nil

}
