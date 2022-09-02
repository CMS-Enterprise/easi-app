package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// BaseStructPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
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
