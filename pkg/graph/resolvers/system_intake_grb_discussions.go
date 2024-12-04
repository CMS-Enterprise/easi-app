package resolvers

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
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

		// get the posting user
		postUser, err := store.UserAccountGetByID(ctx, tx, post.CreatedBy)
		if err != nil {
			return nil, err
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

		// and the grb reviewers
		grbReviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDsNP(ctx, tx, []uuid.UUID{intakeID})
		if err != nil {
			return nil, err
		}

		grbReviewerCache := map[uuid.UUID]*models.SystemIntakeGRBReviewer{}
		// map for ease
		for _, grbReviewer := range grbReviewers {
			// not sure if possible, but just in case
			if grbReviewer == nil {
				continue
			}

			grbReviewerCache[grbReviewer.ID] = grbReviewer
		}

		// check if the grb group is being emailed, in which case we should make sure we do not send any individual emails out
		// unless they are admins
		var groupFound bool
		uniqueTags := input.Content.UniqueTags()
		for _, tag := range uniqueTags {
			if tag.TagType == models.TagTypeGroupGrbReviewers {
				groupFound = true
				break
			}
		}

		// send emails here
		for _, tag := range uniqueTags {
			// don't think this can happen, just for safety
			if tag == nil {
				continue
			}

			switch tag.TagType {
			case models.TagTypeGroupItGov:
				// this is a group tag, and we need to email ITGov box
				if err := emailClient.SystemIntake.SendGRBReviewDiscussionGroupTaggedEmail(ctx, email.SendGRBReviewDiscussionGroupTaggedEmailInput{
					SystemIntakeID:           systemIntake.ID,
					UserName:                 postUser.Username,
					GroupName:                "Governance Admin Team",
					RequestName:              systemIntake.ProjectName.String,
					Role:                     roleFromPoster(post),
					DiscussionContent:        input.Content.ToTemplate(),
					ITGovernanceInboxAddress: "IT_Governance@cms.hhs.gov",
					Recipients:               []models.EmailAddress{"IT_Governance@cms.hhs.gov"},
				}); err != nil {
					return nil, err
				}

			case models.TagTypeGroupGrbReviewers:
				// this is a group tag, and we need to gather everyone from that group
				// make sure we don't send duplicates (i.e., if an individual user and the entire GRB team is tagged, only send one)
			case models.TagTypeUserAccount:
				// if we are emailing the group, we do not need to send out individual emails
				if groupFound {
					continue
				}

				// this is an individual tag
				if _, ok := grbReviewerCache[tag.TaggedContentID]; !ok {
					// this means someone was tagged who should not have been
					logger.Warn("tagged user is not a grb reviewer for this intake", zap.String("systemIntakeID", intakeID.String()))
					continue
				}

				// this is an individual tag, and we need to build an email based on the passed in UUID
				recipient, err := store.UserAccountGetByID(ctx, tx, tag.TaggedContentID)
				if err != nil {
					logger.Error("problem getting recipient by id when sending out tag email notifications", zap.Error(err), zap.String("userID", tag.TaggedContentID.String()))
					continue
				}

				if err := emailClient.SystemIntake.SendGRBReviewDiscussionIndividualTaggedEmail(ctx, email.SendGRBReviewDiscussionIndividualTaggedEmailInput{
					SystemIntakeID:           intakeID,
					UserName:                 postUser.Username,
					RequestName:              systemIntake.ProjectName.String,
					Role:                     roleFromPoster(post),
					DiscussionContent:        input.Content.ToTemplate(),
					ITGovernanceInboxAddress: "IT_Governance@cms.hhs.gov",
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

func roleFromPoster(post *models.SystemIntakeGRBReviewDiscussionPost) string {
	if post.VotingRole == nil || post.GRBRole == nil {
		return ""
	}

	if len(*post.VotingRole) < 1 || len(*post.GRBRole) < 1 {
		return ""
	}

	return fmt.Sprintf("%[1]s, %[2]s", *post.VotingRole, *post.GRBRole)
}
