package dataloaders2

import (
	"context"

	"github.com/google/uuid"
	"github.com/vikstrous/dataloadgen"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

type (
	fetchUserInfosFunc  func(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, error)
	getCedarSystemsFunc func(ctx context.Context) ([]*models.CedarSystem, error)
)

type dataReader struct {
	db              *storage.Store
	fetchUserInfos  fetchUserInfosFunc
	getCedarSystems getCedarSystemsFunc
}

type DataLoaders struct {
	//CedarSystemBookmark *dataloadgen.Loader[models.BookmarkRequest, bool]
	CedarSystem *dataloadgen.Loader[string, *models.CedarSystem]

	SystemIntakeContractNumbers *dataloadgen.Loader[uuid.UUID, []*models.SystemIntakeContractNumber]
	SystemIntakeSystems         *dataloadgen.Loader[uuid.UUID, []*models.SystemIntakeSystem]
	TRBRequestContractNumbers   *dataloadgen.Loader[uuid.UUID, []*models.TRBRequestContractNumber]
	TRBRequestSystems           *dataloadgen.Loader[uuid.UUID, []*models.TRBRequestSystem]

	FetchUserInfosL *dataloadgen.Loader[string, *models.UserInfo]

	//FetchUserInfos  fetchUserInfosFunc
	GetCedarSystems getCedarSystemsFunc
}

func NewDataLoaders(store *storage.Store, fetchUserInfos fetchUserInfosFunc, getCedarSystems getCedarSystemsFunc) *DataLoaders {
	dr := &dataReader{
		db:              store,
		fetchUserInfos:  fetchUserInfos,
		getCedarSystems: getCedarSystems,
	}
	return &DataLoaders{
		// CedarSystemBookmark:         dataloadgen.NewLoader(dr.getCedarSystemIsBookmarked),
		SystemIntakeContractNumbers: dataloadgen.NewLoader(dr.getSystemIntakeContractNumbersBySystemIntakeID),
		SystemIntakeSystems:         dataloadgen.NewLoader(dr.getSystemIntakeSystemsBySystemIntakeID),
		TRBRequestContractNumbers:   dataloadgen.NewLoader(dr.getTRBRequestContractNumbersByTRBRequestID),
		TRBRequestSystems:           dataloadgen.NewLoader(dr.getTRBRequestSystemsByTRBRequestID),

		//FetchUserInfos:  fetchUserInfos,
		GetCedarSystems: getCedarSystems,

		FetchUserInfosL: dataloadgen.NewLoader(dr.fetchUserInfosByEUAUserIDs),

		//// we need to use `fetchUserInfos` but wouldn't be able to pass it as an arg to the actual function
		//FetchUserInfosL: dataloadgen.NewLoader(func(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, []error) {
		//	data, err := fetchUserInfos(ctx, euaUserIDs)
		//	if err != nil {
		//		return nil, []error{err}
		//	}
		//	return data, nil
		//}),
	}
}
