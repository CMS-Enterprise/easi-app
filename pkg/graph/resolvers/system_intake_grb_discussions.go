package resolvers

import (
	"context"
	"errors"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/services"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// CreateSystemIntakeGRBDiscussionPost creates an initial GRB discussion post
func CreateSystemIntakeGRBDiscussionPost(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	input models.CreateSystemIntakeGRBDiscussionPostInput,
) (*models.SystemIntakeGRBReviewDiscussionPost, error) {
	return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*models.SystemIntakeGRBReviewDiscussionPost, error) {
		principal := appcontext.Principal(ctx).Account().ID
		logger := appcontext.ZLogger(ctx)

		intakeID := input.SystemIntakeID
		principalGRBReviewer, err := GetPrincipalGRBReviewerBySystemIntakeID(ctx, intakeID)
		if err != nil {
			return nil, err
		}

		isAdmin := services.AuthorizeRequireGRTJobCode(ctx)
		if principalGRBReviewer == nil && !isAdmin {
			return nil, errors.New("user not authorized to create discussion post")
		}

		post := models.NewSystemIntakeGRBReviewDiscussionPost(principal)
		post.Content = input.Content.RawContent
		post.SystemIntakeID = intakeID
		if principalGRBReviewer != nil {
			post.VotingRole = &principalGRBReviewer.GRBVotingRole
			post.GRBRole = &principalGRBReviewer.GRBReviewerRole
		}

		// save in DB
		result, err := store.CreateSystemIntakeGRBDiscussionPost(ctx, tx, post)
		if err != nil {
			return nil, err
		}

		// if no tags, we can return here
		if len(input.Content.Tags) < 1 {
			return result, nil
		}

		// otherwise, we need the full system intake
		systemIntake, err := store.FetchSystemIntakeByIDNP(ctx, tx, intakeID)
		if err != nil {
			return nil, err
		}

		// send emails here
		for _, tag := range input.Content.Tags {
			// don't think this can happen, just for safety
			if tag == nil {
				continue
			}

			if tag.TagType.IsGroup() {
				// this is a group tag, and we need to gather everyone from that group

			} else {
				// this is an individual tag, and we need to build an email based on the passed in UUID
				recipient, err := store.UserAccountGetByID(ctx, tx, tag.TaggedContentID)
				if err != nil {
					logger.Error("problem getting recipient by id when sending out tag email notifications", zap.Error(err), zap.String("userID", tag.TaggedContentID.String()))
					continue
				}

				if err := emailClient.SystemIntake.SendGRBReviewDiscussionIndividualTaggedEmail(ctx, email.SendGRBReviewDiscussionIndividualTaggedEmailInput{
					SystemIntakeID:           intakeID,
					UserName:                 recipient.Username,
					RequestName:              systemIntake.ProjectName.String,
					DiscussionBoardType:      "",
					Role:                     "",
					DiscussionContent:        input.Content.ToTemplate(),
					ITGovernanceInboxAddress: "",
					Recipient:                models.EmailAddress(recipient.Email),
				}); err != nil {
					return nil, err
				}
			}
		}

		return result, nil
	})
}

// CreateSystemIntakeGRBDiscussionReply creates a reply to a GRB Discussion post
func CreateSystemIntakeGRBDiscussionReply(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	input models.CreateSystemIntakeGRBDiscussionReplyInput,
) (*models.SystemIntakeGRBReviewDiscussionPost, error) {
	return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*models.SystemIntakeGRBReviewDiscussionPost, error) {
		initialPost, err := store.GetSystemIntakeGRBDiscussionPostByID(ctx, tx, input.InitialPostID)
		if err != nil {
			return nil, err
		}
		intakeID := initialPost.SystemIntakeID
		if initialPost.ReplyToID != nil {
			return nil, errors.New("only top level posts can be replied to")
		}
		principalGRBReviewer, err := GetPrincipalGRBReviewerBySystemIntakeID(ctx, intakeID)
		if err != nil {
			return nil, err
		}
		isAdmin := services.AuthorizeRequireGRTJobCode(ctx)
		if principalGRBReviewer == nil && !isAdmin {
			return nil, errors.New("user not authorized to create discussion post")
		}
		post := models.NewSystemIntakeGRBReviewDiscussionPost(appcontext.Principal(ctx).Account().ID)
		post.Content = input.Content.RawContent
		post.SystemIntakeID = intakeID
		post.ReplyToID = &initialPost.ID
		if principalGRBReviewer != nil {
			post.VotingRole = &principalGRBReviewer.GRBVotingRole
			post.GRBRole = &principalGRBReviewer.GRBReviewerRole
		}
		return store.CreateSystemIntakeGRBDiscussionPost(ctx, tx, post)
	})
}
