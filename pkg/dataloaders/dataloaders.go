package dataloaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/vikstrous/dataloadgen"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

type (
	// BuildDataloaders builds and returns a set of dataloaders - useful for supplying each new HTTP request with its
	// own set of dataloaders
	BuildDataloaders func() *Dataloaders

	// for convenience and cleaner function definitions
	fetchUserInfosFunc  func(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, error)
	getCedarSystemsFunc func(ctx context.Context) ([]*models.CedarSystem, error)
)

// dataReader's main responsibility is `db` access
// it can also be used hold onto methods that can vary depending on environments (ex: test vs. prod)
type dataReader struct {
	db              *storage.Store
	fetchUserInfos  fetchUserInfosFunc
	getCedarSystems getCedarSystemsFunc
}

// Dataloaders houses all dataloader-capable functionality
// to create a new dataloader, create a new property in this struct and give it the request type and return type for ONE
// item (i.e., even though you can pass a dataloader a list of UUIDs to get a list of UserAccounts, the definition must
// be one-one (request-response) - in this example [uuid.UUID, UserAccount])
//
// then, create a file in this package and create two functions in there
//  1. a method on the `dataReader` type - this is our batching function
//     - this function will take a slice of the request type (in the example above, it would take []uuid.UUID)
//     - this function will return a slice of the response type (in this example, []UserAccount)
//  2. an exported function which takes/returns the one-one relationship defined below
//
// example of this:
/*
	// take in a slice of inputs (uuids) and returns a slice of outputs (each uuid gets its own slice of `*models.SystemIntakeSystem`)
	func (d *dataReader) batchSystemIntakeSystemsBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeSystem, []error) {
		data, err := d.db.SystemIntakeSystemsBySystemIntakeIDs(ctx, systemIntakeIDs)
		if err != nil {
			return nil, []error{err}
		}

		return helpers.OneToMany[*models.SystemIntakeSystem](systemIntakeIDs, data), nil
	}

	// take in a one-one relationship (a single uuid gets a single slice)
	func GetSystemIntakeSystemsBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeSystem, error) {
		loaders, ok := loadersFromCTX(ctx)
		if !ok {
			return nil, errors.New("unexpected nil loaders in GetSystemIntakeSystemsBySystemIntakeID")
		}

		return loaders.SystemIntakeSystems.Load(ctx, systemIntakeID)
	}
*/
// you can then edit NewDataloaders below to include your new dataloader in the return
type Dataloaders struct {
	CedarSystemBookmark              *dataloadgen.Loader[models.BookmarkRequest, bool]
	CedarSystemLinkedSystemIntakes   *dataloadgen.Loader[models.SystemIntakesByCedarSystemIDsRequest, []*models.SystemIntake]
	CedarSystemLinkedTRBRequests     *dataloadgen.Loader[models.TRBRequestsByCedarSystemIDsRequest, []*models.TRBRequest]
	FetchUserInfo                    *dataloadgen.Loader[string, *models.UserInfo]
	GetUserAccount                   *dataloadgen.Loader[uuid.UUID, *authentication.UserAccount]
	GetCedarSystem                   *dataloadgen.Loader[string, *models.CedarSystem]
	SystemIntakeActions              *dataloadgen.Loader[uuid.UUID, []*models.Action]
	SystemIntakeContractNumbers      *dataloadgen.Loader[uuid.UUID, []*models.SystemIntakeContractNumber]
	SystemIntakeFundingSources       *dataloadgen.Loader[uuid.UUID, []*models.SystemIntakeFundingSource]
	SystemIntakeGRBReviewers         *dataloadgen.Loader[uuid.UUID, []*models.SystemIntakeGRBReviewer]
	SystemIntakeNotes                *dataloadgen.Loader[uuid.UUID, []*models.SystemIntakeNote]
	SystemIntakeRelatedSystemIntakes *dataloadgen.Loader[uuid.UUID, []*models.SystemIntake]
	SystemIntakeRelatedTRBRequests   *dataloadgen.Loader[uuid.UUID, []*models.TRBRequest]
	SystemIntakeSystems              *dataloadgen.Loader[uuid.UUID, []*models.SystemIntakeSystem]
	TRBFundingSources                *dataloadgen.Loader[uuid.UUID, []*models.TRBFundingSource]
	TRBRequestAdminNotes             *dataloadgen.Loader[uuid.UUID, []*models.TRBAdminNote]
	TRBRequestAdviceLetter           *dataloadgen.Loader[uuid.UUID, *models.TRBAdviceLetter]
	TRBRequestAttendees              *dataloadgen.Loader[uuid.UUID, []*models.TRBRequestAttendee]
	TRBRequestAttendeeByEUA          *dataloadgen.Loader[models.TRBAttendeeByTRBAndEUAIDRequest, *models.TRBRequestAttendee]
	TRBRequestContractNumbers        *dataloadgen.Loader[uuid.UUID, []*models.TRBRequestContractNumber]
	TRBRequestDocuments              *dataloadgen.Loader[uuid.UUID, []*models.TRBRequestDocument]
	TRBRequestForm                   *dataloadgen.Loader[uuid.UUID, *models.TRBRequestForm]
	TRBRequestFeedback               *dataloadgen.Loader[uuid.UUID, []*models.TRBRequestFeedback]
	TRBRequestFeedbackNewest         *dataloadgen.Loader[uuid.UUID, *models.TRBRequestFeedback]
	TRBRequestRelatedSystemIntakes   *dataloadgen.Loader[uuid.UUID, []*models.SystemIntake]
	TRBRequestRelatedTRBRequests     *dataloadgen.Loader[uuid.UUID, []*models.TRBRequest]
	TRBRequestSystems                *dataloadgen.Loader[uuid.UUID, []*models.TRBRequestSystem]
	TRBRequestFormSystemIntakes      *dataloadgen.Loader[uuid.UUID, []*models.SystemIntake]
}

// NewDataloaders returns a new set of dataloaders
func NewDataloaders(store *storage.Store, fetchUserInfos fetchUserInfosFunc, getCedarSystems getCedarSystemsFunc) *Dataloaders {
	dr := &dataReader{
		db:              store,
		fetchUserInfos:  fetchUserInfos,
		getCedarSystems: getCedarSystems,
	}
	return &Dataloaders{
		CedarSystemBookmark:              dataloadgen.NewLoader(dr.batchCedarSystemIsBookmarked),
		CedarSystemLinkedTRBRequests:     dataloadgen.NewLoader(dr.batchCedarSystemLinkedTRBRequests),
		CedarSystemLinkedSystemIntakes:   dataloadgen.NewLoader(dr.batchCedarSystemLinkedSystemIntakes),
		FetchUserInfo:                    dataloadgen.NewLoader(dr.fetchUserInfosByEUAUserIDs),
		GetUserAccount:                   dataloadgen.NewLoader(dr.batchUserAccountsByIDs),
		GetCedarSystem:                   dataloadgen.NewLoader(dr.getCedarSystemsByIDs),
		SystemIntakeActions:              dataloadgen.NewLoader(dr.batchSystemIntakeActionsBySystemIntakeIDs),
		SystemIntakeContractNumbers:      dataloadgen.NewLoader(dr.batchSystemIntakeContractNumbersBySystemIntakeIDs),
		SystemIntakeFundingSources:       dataloadgen.NewLoader(dr.batchSystemIntakeFundingSourcesBySystemIntakeIDs),
		SystemIntakeGRBReviewers:         dataloadgen.NewLoader(dr.batchSystemIntakeGRBReviewersBySystemIntakeIDs),
		SystemIntakeNotes:                dataloadgen.NewLoader(dr.batchSystemIntakeNotesBySystemIntakeIDs),
		SystemIntakeRelatedSystemIntakes: dataloadgen.NewLoader(dr.batchRelatedSystemIntakesBySystemIntakeIDs),
		SystemIntakeRelatedTRBRequests:   dataloadgen.NewLoader(dr.batchRelatedTRBRequestsBySystemIntakeIDs),
		SystemIntakeSystems:              dataloadgen.NewLoader(dr.batchSystemIntakeSystemsBySystemIntakeIDs),
		TRBFundingSources:                dataloadgen.NewLoader(dr.batchTRBFundingSourcesByTRBRequestIDs),
		TRBRequestAdminNotes:             dataloadgen.NewLoader(dr.batchTRBRequestAdminNotesByTRBRequestIDs),
		TRBRequestAdviceLetter:           dataloadgen.NewLoader(dr.batchTRBRequestAdviceLettersByTRBRequestIDs),
		TRBRequestAttendees:              dataloadgen.NewLoader(dr.batchTRBRequestAttendeesByTRBRequestIDs),
		TRBRequestAttendeeByEUA:          dataloadgen.NewLoader(dr.batchTRBRequestAttendeesByEUAIDsAndTRBRequestIDs),
		TRBRequestContractNumbers:        dataloadgen.NewLoader(dr.batchTRBRequestContractNumbersByTRBRequestIDs),
		TRBRequestDocuments:              dataloadgen.NewLoader(dr.batchTRBRequestDocumentsByTRBRequestIDs),
		TRBRequestForm:                   dataloadgen.NewLoader(dr.batchTRBRequestFormsByTRBRequestIDs),
		TRBRequestFeedback:               dataloadgen.NewLoader(dr.batchTRBRequestFeedbackByTRBRequestIDs),
		TRBRequestFeedbackNewest:         dataloadgen.NewLoader(dr.batchTRBRequestNewestFeedbackByTRBRequestIDs),
		TRBRequestRelatedSystemIntakes:   dataloadgen.NewLoader(dr.batchRelatedSystemIntakesByTRBRequestIDs),
		TRBRequestRelatedTRBRequests:     dataloadgen.NewLoader(dr.batchRelatedTRBRequestsByTRBRequestIDs),
		TRBRequestSystems:                dataloadgen.NewLoader(dr.batchTRBRequestSystemsByTRBRequestIDs),
		TRBRequestFormSystemIntakes:      dataloadgen.NewLoader(dr.batchTRBRequestFormSystemIntakesByTRBRequestIDs),
	}
}
