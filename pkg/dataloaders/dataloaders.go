package dataloaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/vikstrous/dataloadgen"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

type (
	DataloaderFunc      func() *DataLoaders
	fetchUserInfosFunc  func(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, error)
	getCedarSystemsFunc func(ctx context.Context) ([]*models.CedarSystem, error)
)

type dataReader struct {
	db              *storage.Store
	fetchUserInfos  fetchUserInfosFunc
	getCedarSystems getCedarSystemsFunc
}

type DataLoaders struct {
	CedarSystemBookmark         *dataloadgen.Loader[models.BookmarkRequest, bool]
	FetchUserInfos              *dataloadgen.Loader[string, *models.UserInfo]
	GetCedarSystems             *dataloadgen.Loader[string, *models.CedarSystem]
	SystemIntakeContractNumbers *dataloadgen.Loader[uuid.UUID, []*models.SystemIntakeContractNumber]
	SystemIntakeSystems         *dataloadgen.Loader[uuid.UUID, []*models.SystemIntakeSystem]
	TRBRequestContractNumbers   *dataloadgen.Loader[uuid.UUID, []*models.TRBRequestContractNumber]
	TRBRequestSystems           *dataloadgen.Loader[uuid.UUID, []*models.TRBRequestSystem]
}

func NewDataLoaders(store *storage.Store, fetchUserInfos fetchUserInfosFunc, getCedarSystems getCedarSystemsFunc) *DataLoaders {
	dr := &dataReader{
		db:              store,
		fetchUserInfos:  fetchUserInfos,
		getCedarSystems: getCedarSystems,
	}
	return &DataLoaders{
		CedarSystemBookmark:         dataloadgen.NewLoader(dr.getCedarSystemIsBookmarked),
		FetchUserInfos:              dataloadgen.NewLoader(dr.fetchUserInfosByEUAUserIDs),
		GetCedarSystems:             dataloadgen.NewLoader(dr.getCedarSystemsByIDs),
		SystemIntakeContractNumbers: dataloadgen.NewLoader(dr.getSystemIntakeContractNumbersBySystemIntakeID),
		SystemIntakeSystems:         dataloadgen.NewLoader(dr.getSystemIntakeSystemsBySystemIntakeID),
		TRBRequestContractNumbers:   dataloadgen.NewLoader(dr.getTRBRequestContractNumbersByTRBRequestID),
		TRBRequestSystems:           dataloadgen.NewLoader(dr.getTRBRequestSystemsByTRBRequestID),
	}
}
