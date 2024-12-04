package main

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func createSystemIntakeGRBDiscussionPost(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	intake *models.SystemIntake,
	content models.TaggedHTML,
) *models.SystemIntakeGRBReviewDiscussionPost {
	post, err := resolvers.CreateSystemIntakeGRBDiscussionPost(
		ctx,
		store,
		emailClient, // email client
		models.CreateSystemIntakeGRBDiscussionPostInput{
			SystemIntakeID: intake.ID,
			Content:        content,
		},
	)
	if err != nil {
		panic(err)
	}
	return post
}

func createSystemIntakeGRBDiscussionReply(
	ctx context.Context,
	store *storage.Store,
	initialPostID uuid.UUID,
	content models.TaggedHTML,
) *models.SystemIntakeGRBReviewDiscussionPost {
	reply, err := resolvers.CreateSystemIntakeGRBDiscussionReply(
		ctx,
		store,
		nil, // email client
		models.CreateSystemIntakeGRBDiscussionReplyInput{
			InitialPostID: initialPostID,
			Content:       content,
		},
	)
	if err != nil {
		panic(err)
	}
	return reply
}
