package resolvers

import (
	"github.com/cms-enterprise/easi-app/pkg/applychanges"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// BaseStructPreUpdate is a hook to call before updating a baseStruct object in the database it will
// 1. Update the base struct meta data
// 2. If applyChanges is true, Apply changes from the changes object to the provided IBaseStruct
func BaseStructPreUpdate(changes map[string]any, bs models.IBaseStruct, principal authentication.Principal, applyChanges bool) error {

	err := bs.SetModifiedBy(principal)
	if err != nil {
		return err
	}

	if applyChanges {

		err := applychanges.ApplyChanges(changes, bs)
		if err != nil {
			return err
		}
	}

	return nil

}
