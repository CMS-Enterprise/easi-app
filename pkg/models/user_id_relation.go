package models

import (
	"context"
	"fmt"

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
	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get user account, there is an issue with the user account service. err %w", err)
	}
	account, err := service(ctx, b.UserID)
	if err != nil {
		return nil, err
	}
	return account, nil
}
