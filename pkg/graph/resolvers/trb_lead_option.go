package resolvers

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// GetTRBLeadOptions retrieves TRB options from the database and returns EUA user info for each lead option
func GetTRBLeadOptions(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
) ([]*models.UserInfo, error) {
	leadOptions, err := store.GetTRBLeadOptions(ctx)
	if err != nil {
		return nil, err
	}

	leadEuas := make([]string, len(leadOptions))
	for i, leadOption := range leadOptions {
		leadEuas[i] = leadOption.EUAUserID
	}

	leadInfos, err := fetchUserInfos(ctx, leadEuas)
	if err != nil {
		return nil, err
	}

	return leadInfos, err
}

// CreateTRBLeadOption creates a TRBLeadOption in the database and returns the user info for the
// created lead option
func CreateTRBLeadOption(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	euaID string,
) (*models.UserInfo, error) {
	// Make sure it's a valid EUA
	leadUserInfo, err := fetchUserInfo(ctx, euaID)
	if err != nil {
		return nil, err
	}

	leadOption := &models.TRBLeadOption{
		EUAUserID: euaID,
	}
	leadOption.CreatedBy = appcontext.Principal(ctx).ID()

	_, err = store.CreateTRBLeadOption(ctx, leadOption)
	if err != nil {
		return nil, err
	}

	return leadUserInfo, nil
}

// DeleteTRBLeadOption deletes a TRBLeadOption record from the database
func DeleteTRBLeadOption(ctx context.Context, store *storage.Store, euaID string) (bool, error) {
	_, err := store.DeleteTRBLeadOption(ctx, euaID)
	if err != nil {
		return false, err
	}
	return true, nil
}
