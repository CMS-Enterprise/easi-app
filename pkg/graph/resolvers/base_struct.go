package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/applychanges"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// ApplyChangesAndMetaData is a hook to call before updating a baseStruct object in the database it will
// 1. Update the base struct meta data
// 2. Apply changes from the changes object to the provided IBaseStruct
func ApplyChangesAndMetaData(logger *zap.Logger, bs models.IBaseStruct, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) error {
	section := bs.GetBaseStruct()

	modified := principal.ID()

	section.ModifiedBy = &modified

	err := applychanges.ApplyChanges(changes, bs)
	if err != nil {
		return err
	}

	return nil

}
