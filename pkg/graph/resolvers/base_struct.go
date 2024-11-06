package resolvers

import (
	"github.com/cms-enterprise/easi-app/pkg/applychanges"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// ApplyChangesAndMetaData is a hook to call before updating a baseStruct object in the database it will
// 1. Update the base struct meta data
// 2. Apply changes from the changes object to the provided IBaseStruct
func ApplyChangesAndMetaData(changes map[string]interface{}, bs models.IBaseStruct, principal authentication.Principal) error {

	err := bs.SetModifiedBy(principal)
	if err != nil {
		return err
	}

	err = applychanges.ApplyChanges(changes, bs)
	if err != nil {
		return err
	}

	return nil

}
