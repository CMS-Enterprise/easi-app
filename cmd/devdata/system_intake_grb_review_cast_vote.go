package main

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func castSytemIntakeGRBReviewerVote(
	ctx context.Context,
	store *storage.Store,
	input models.CastSystemIntakeGRBReviewerVoteInput,
) {
	_, err := resolvers.CastSystemIntakeGRBReviewerVote(
		ctx,
		store,
		input,
	)

	if err != nil {
		panic(err)
	}
}
