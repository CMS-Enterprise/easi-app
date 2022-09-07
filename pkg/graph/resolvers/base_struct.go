package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// BaseStructPreUpdate is a hook to call before updating a baseStruct object in the database it will
// 1. Update the base struct meta data
// 2. Apply changes from the changes object to the provided base struct if applyChanges == true
func BaseStructPreUpdate(logger *zap.Logger, bs models.IBaseStruct, changes map[string]interface{}, principal authentication.Principal, store *storage.Store, applyChanges bool) error {
	section := bs.GetBaseStruct()

	modified := principal.ID()

	section.ModifiedBy = &modified

	if applyChanges {

		err := ApplyChanges(changes, bs)
		if err != nil {
			return err
		}
	}

	return nil

}
