package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/graph/generated"
	"github.com/cmsgov/easi-app/pkg/graph/model"
)

func (r *accessibilityRequestResolver) ID(ctx context.Context, obj *model.AccessibilityRequest) (string, error) {
	return obj.ID.String(), nil
}

func (r *mutationResolver) CreateAccessibilityRequest(ctx context.Context, input *model.CreateAccessibilityRequestInput) (*model.CreateAccessibilityRequestPayload, error) {
	request, err := r.store.CreateAccessibilityRequest(ctx, &model.AccessibilityRequest{
		Name: input.Name,
	})
	if err != nil {
		return nil, err
	}

	return &model.CreateAccessibilityRequestPayload{
		AccessibilityRequest: request,
		UserErrors:           nil,
	}, nil
}

func (r *queryResolver) AccessibilityRequests(ctx context.Context, first int, after *string) (*model.AccessibilityRequestsConnection, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) AccessibilityRequest(ctx context.Context, id string) (*model.AccessibilityRequest, error) {
	panic(fmt.Errorf("not implemented"))
}

// AccessibilityRequest returns generated.AccessibilityRequestResolver implementation.
func (r *Resolver) AccessibilityRequest() generated.AccessibilityRequestResolver {
	return &accessibilityRequestResolver{r}
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type accessibilityRequestResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
