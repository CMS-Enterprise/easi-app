package resolvers

import (
	"context"
	"errors"
	"fmt"
	"html/template"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/samber/lo"
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
		principal := appcontext.Principal(ctx)

		intakeID := input.SystemIntakeID

		// fetch system intake for email logic
		systemIntake, err := store.FetchSystemIntakeByIDNP(ctx, tx, intakeID)
		if err != nil {
			return nil, err
		}

		principalAsGRBReviewer, err := GetPrincipalAsGRBReviewerBySystemIntakeID(ctx, intakeID)
		if err != nil {
			return nil, err
		}

		isAdmin := services.AuthorizeRequireGRTJobCode(ctx)
		if principalAsGRBReviewer == nil && !isAdmin {
			return nil, errors.New("user not authorized to create discussion post")
		}

		post := models.NewSystemIntakeGRBReviewDiscussionPost(principal.Account().ID)
		post.Content = input.Content.RawContent
		post.SystemIntakeID = intakeID
		if principalAsGRBReviewer != nil {
			post.VotingRole = &principalAsGRBReviewer.GRBVotingRole
			post.GRBRole = &principalAsGRBReviewer.GRBReviewerRole
		}

		// save in DB
		result, err := store.CreateSystemIntakeGRBDiscussionPost(ctx, tx, post)
		if err != nil {
			return nil, err
		}

		if emailClient == nil {
			return result, nil
		}

		err = sendDiscussionEmailsForTags(
			ctx,
			store,
			emailClient,
			tx,
			intakeID,
			systemIntake.ProjectName.String,
			post.ID,
			getAuthorRoleFromPost(post),
			input.Content.UniqueTags(),
			input.Content.ToTemplate(),
		)
		if err != nil {
			return nil, err
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

		principalGRBReviewer, err := GetPrincipalAsGRBReviewerBySystemIntakeID(ctx, intakeID)
		if err != nil {
			return nil, err
		}

		isAdmin := services.AuthorizeRequireGRTJobCode(ctx)
		if principalGRBReviewer == nil && !isAdmin {
			return nil, errors.New("user not authorized to create discussion post")
		}

		// get user who made this reply post
		replyPoster := appcontext.Principal(ctx).Account()
		post := models.NewSystemIntakeGRBReviewDiscussionPost(replyPoster.ID)
		post.Content = input.Content.RawContent
		post.SystemIntakeID = intakeID
		post.ReplyToID = &initialPost.ID
		if principalGRBReviewer != nil {
			post.VotingRole = &principalGRBReviewer.GRBVotingRole
			post.GRBRole = &principalGRBReviewer.GRBReviewerRole
		}

		result, err := store.CreateSystemIntakeGRBDiscussionPost(ctx, tx, post)
		if err != nil {
			return nil, err
		}

		systemIntake, err := store.FetchSystemIntakeByIDNP(ctx, tx, intakeID)
		if err != nil {
			return nil, err
		}

		if systemIntake == nil {
			return nil, errors.New("problem finding system intake when handling GRB reply")
		}

		// the initial poster will receive a notification
		// in the event the initial poster is also tagged in a reply, we do not send both emails
		// we only send the "someone replied" email
		initialPoster, err := initialPost.CreatedByUserAccount(ctx)
		if err != nil {
			return nil, err
		}

		if initialPoster == nil {
			return nil, errors.New("problem finding initial poster when handling GRB reply")
		}

		// if no email client, do not proceed
		if emailClient == nil {
			return result, nil
		}

		// so first, we can send the reply email
		authorRole := getAuthorRoleFromPost(post)
		if err := emailClient.SystemIntake.SendGRBReviewDiscussionReplyEmail(ctx, email.SendGRBReviewDiscussionReplyEmailInput{
			SystemIntakeID:    intakeID,
			UserName:          replyPoster.CommonName,
			RequestName:       systemIntake.ProjectName.String,
			DiscussionID:      initialPost.ID,
			Role:              authorRole,
			DiscussionContent: input.Content.ToTemplate(),
			Recipient:         models.EmailAddress(initialPoster.Email),
		}); err != nil {
			return nil, err
		}

		uniqueTags := input.Content.UniqueTags()
		// strip discussion author from tags in case author was tagged
		uniqueTagsWithoutInitialPoster := lo.Filter(uniqueTags, func(t *models.Tag, _ int) bool {
			return t.TaggedContentID != initialPoster.ID
		})

		// then handle emails for tags in the post
		err = sendDiscussionEmailsForTags(
			ctx,
			store,
			emailClient,
			tx,
			intakeID,
			systemIntake.ProjectName.String,
			initialPost.ID,
			authorRole,
			uniqueTagsWithoutInitialPoster,
			input.Content.ToTemplate(),
		)
		if err != nil {
			return nil, err
		}

		return result, nil
	})
}

// handles sending emails for various tags in a discussion post
func sendDiscussionEmailsForTags(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	tx *sqlx.Tx,
	intakeID uuid.UUID,
	intakeRequestName string,
	discussionID uuid.UUID,
	postAuthorRole string,
	uniqueTags []*models.Tag,
	content template.HTML,
) error {
	// if no tags, we can return here
	if len(uniqueTags) < 1 {
		return nil
	}

	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)

	grbReviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDsNP(ctx, tx, []uuid.UUID{intakeID})
	if err != nil {
		return err
	}

	grbReviewerCache := map[uuid.UUID]*models.SystemIntakeGRBReviewer{}
	// map for ease
	for _, grbReviewer := range grbReviewers {
		// not sure if possible, but just in case
		if grbReviewer == nil {
			continue
		}

		grbReviewerCache[grbReviewer.UserID] = grbReviewer
	}

	// check if the grb group is being emailed, in which case we should make sure we do not send any individual emails out
	var grbGroupFound bool

	groupTagTypes := []models.TagType{}
	individualTagAcctIDs := []uuid.UUID{}

	// split individual and group tags
	for _, tag := range uniqueTags {
		if tag == nil {
			continue
		}
		if tag.TagType == models.TagTypeUserAccount {
			if _, ok := grbReviewerCache[tag.TaggedContentID]; !ok {
				// this means someone was tagged who should not have been
				logger.Info("tagged user is not a grb reviewer for this intake", zap.String("systemIntakeID", intakeID.String()))
				continue
			}
			individualTagAcctIDs = append(individualTagAcctIDs, tag.TaggedContentID)
		} else {
			if tag.TagType == models.TagTypeGroupGrbReviewers {
				grbGroupFound = true
			}
			groupTagTypes = append(groupTagTypes, tag.TagType)
		}
	}

	// handle group tags
	if len(groupTagTypes) > 0 {
		// send email for each tag group
		for _, groupTagType := range groupTagTypes {
			recipients := models.EmailNotificationRecipients{}
			var groupName string

			switch groupTagType {

			case models.TagTypeGroupItGov:
				recipients.ShouldNotifyITGovernance = true
				groupName = "Governance Admin Team"

			case models.TagTypeGroupGrbReviewers:
				groupName = "GRB"
				reviewerIDs := lo.Keys(grbReviewerCache)
				grbAccts, err := store.UserAccountsByIDsNP(ctx, tx, reviewerIDs)
				if err != nil {
					logger.Error("problem getting recipients by id when sending out tag email notifications", zap.Error(err))
					return err
				}
				for _, acct := range grbAccts {
					recipients.RegularRecipientEmails = append(recipients.RegularRecipientEmails, models.EmailAddress(acct.Email))
				}

			// should never happen, but skip these cases
			case models.TagTypeUserAccount:
				continue
			default:
				continue
			}

			if err := emailClient.SystemIntake.SendGRBReviewDiscussionGroupTaggedEmail(ctx, email.SendGRBReviewDiscussionGroupTaggedEmailInput{
				SystemIntakeID:    intakeID,
				UserName:          principal.Account().CommonName,
				GroupName:         groupName,
				RequestName:       intakeRequestName,
				Role:              postAuthorRole,
				DiscussionID:      discussionID,
				DiscussionContent: content,
				Recipients:        recipients,
			}); err != nil {
				return err
			}
		}
	}

	// handle and get email addresses for individual tags
	if !grbGroupFound && len(individualTagAcctIDs) > 0 {
		// for individual tags, we need to build an email based on the passed in UUID
		recipientAccts, err := store.UserAccountsByIDsNP(ctx, tx, individualTagAcctIDs)
		recipients := []models.EmailAddress{}
		for _, recipientAcct := range recipientAccts {
			recipients = append(recipients, models.EmailAddress(recipientAcct.Email))
		}
		if err != nil {
			logger.Error("problem getting recipients by id when sending out tag email notifications", zap.Error(err))
			return err
		}

		if err := emailClient.SystemIntake.SendGRBReviewDiscussionIndividualTaggedEmail(ctx, email.SendGRBReviewDiscussionIndividualTaggedEmailInput{
			SystemIntakeID:    intakeID,
			UserName:          principal.Account().CommonName,
			RequestName:       intakeRequestName,
			Role:              postAuthorRole,
			DiscussionID:      discussionID,
			DiscussionContent: content,
			Recipients:        recipients,
		}); err != nil {
			return err
		}
	}
	return nil
}

func getAuthorRoleFromPost(post *models.SystemIntakeGRBReviewDiscussionPost) string {
	if post.VotingRole == nil || post.GRBRole == nil {
		return "Governance Admin Team"
	}

	if len(*post.VotingRole) < 1 || len(*post.GRBRole) < 1 {
		return "Governance Admin Team"
	}

	return fmt.Sprintf("%[1]s member, %[2]s", post.VotingRole.Humanize(), post.GRBRole.Humanize())
}
