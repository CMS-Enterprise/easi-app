package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/graph/generated"
	"github.com/cmsgov/easi-app/graph/model"
)

func (r *mutationResolver) CreateAccessibilityRequest(ctx context.Context, input *model.CreateAccessibilityRequestInput) (*model.CreateAccessibilityRequestPayload, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) AccessibilityRequests(ctx context.Context, first int, after *string) (*model.AccessibilityRequestsConnection, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) AccessibilityRequest(ctx context.Context, id string) (*model.AccessibilityRequest, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
