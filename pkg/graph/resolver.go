package graph

import (
	"context"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"
	ldclient "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	cedarcore "github.com/cmsgov/easi-app/pkg/cedar/core"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/upload"
)

//go:generate go run github.com/99designs/gqlgen

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver is a resolver.
type Resolver struct {
	store           *storage.Store
	service         ResolverService
	s3Client        *upload.S3Client
	emailClient     *email.Client
	ldClient        *ldclient.LDClient
	cedarCoreClient *cedarcore.Client
}

func (r *Resolver) checkBoolFeatureFlag(ctx context.Context, flagName string, flagDefault bool) bool {
	lduser := flags.Principal(ctx)
	result, err := r.ldClient.BoolVariation(flagName, lduser, flagDefault)
	if err != nil {
		appcontext.ZLogger(ctx).Info(
			"problem evaluating feature flag",
			zap.Error(err),
			zap.String("flagName", flagName),
			zap.Bool("flagDefault", flagDefault),
			zap.Bool("flagResult", result),
		)
	}
	return result
}

// ResolverService holds service methods for use in resolvers
type ResolverService struct {
	CreateTestDate                func(context.Context, *models.TestDate) (*models.TestDate, error)
	AddGRTFeedback                func(context.Context, *models.GRTFeedback, *models.Action, models.SystemIntakeStatus, bool) (*models.GRTFeedback, error)
	CreateActionUpdateStatus      func(context.Context, *models.Action, uuid.UUID, models.SystemIntakeStatus, bool, bool) (*models.SystemIntake, error)
	CreateActionExtendLifecycleID func(context.Context, *models.Action, uuid.UUID, *time.Time, *string, string, *string, bool) (*models.SystemIntake, error)
	IssueLifecycleID              func(context.Context, *models.SystemIntake, *models.Action, bool, *models.EmailNotificationRecipients) (*models.SystemIntake, error)
	RejectIntake                  func(context.Context, *models.SystemIntake, *models.Action, bool) (*models.SystemIntake, error)
	FetchUserInfo                 func(context.Context, string) (*models.UserInfo, error)
	SearchCommonNameContains      func(context.Context, string) ([]*models.UserInfo, error)
	SubmitIntake                  func(context.Context, *models.SystemIntake, *models.Action) error
}

// NewResolver constructs a resolver
func NewResolver(
	store *storage.Store,
	service ResolverService,
	s3Client *upload.S3Client,
	emailClient *email.Client,
	ldClient *ldclient.LDClient,
	cedarCoreClient *cedarcore.Client,
) *Resolver {
	return &Resolver{store: store, service: service, s3Client: s3Client, emailClient: emailClient, ldClient: ldClient, cedarCoreClient: cedarCoreClient}
}
