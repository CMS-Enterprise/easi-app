package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/graph/generated"
	"github.com/cmsgov/easi-app/graph/model"
)

func (r *mutationResolver) CreateProject(ctx context.Context, project *model.ProjectInput) (*model.ProjectUpdateResponse, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) CreateDocument(ctx context.Context, input *model.DocumentInput) (*model.DocumentUpdateResponse, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Projects(ctx context.Context) ([]*model.Project, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Project(ctx context.Context, id string) (*model.Project, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
