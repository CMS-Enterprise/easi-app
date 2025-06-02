package resolvers

import (
	"context"

	ldclient "gopkg.in/launchdarkly/go-server-sdk.v5"

	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/upload"
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

// ResolverService holds service methods for use in resolvers
type ResolverService struct {
	FetchUserInfo            func(context.Context, string) (*models.UserInfo, error)
	FetchUserInfos           func(context.Context, []string) ([]*models.UserInfo, error)
	SearchCommonNameContains func(context.Context, string) ([]*models.UserInfo, error)
	SubmitIntake             func(context.Context, *models.SystemIntake, *models.Action) error
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
