package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"strconv"

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
	var projects []*model.Project
	for i := 1; i <= 10; i++ {
		projects = append(projects, &model.Project{ID: strconv.Itoa(i), Name: fmt.Sprintf("Project #%d", i)})
	}
	return projects, nil
}

func (r *queryResolver) Project(ctx context.Context, id string) (*model.Project, error) {
	project := model.Project{ID: id, Name: fmt.Sprintf("Project #%s", id)}
	return &project, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
