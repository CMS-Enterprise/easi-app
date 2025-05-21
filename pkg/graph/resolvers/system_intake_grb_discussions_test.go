package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/helpers"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func (s *ResolverSuite) TestSystemIntakeGRBDiscussions() {
	store := s.testConfigs.Store

	s.Run("create and retrieve initial discussion", func() {
		emailClient, _ := NewEmailClient()

		intake := s.createNewIntake()
		ctx, _ := s.getTestContextWithPrincipal("ABCD", true)
		post := s.createGRBDiscussion(
			ctx,
			emailClient,
			intake.ID,
			"<p>banana</p>",
		)

		// test the resolver for retrieving discussions
		discussions, err := SystemIntakeGRBDiscussions(ctx, intake.ID, models.SystemIntakeGRBDiscussionBoardTypePrimary)
		s.NotNil(discussions)
		s.NoError(err)
		s.Len(discussions, 1)
		s.Equal(discussions[0].InitialPost.ID, post.ID)
		s.Equal(discussions[0].InitialPost.CreatedBy, post.CreatedBy)
		s.Equal(discussions[0].InitialPost.Content, post.Content)
		s.Len(discussions[0].Replies, 0)
	})

	s.Run("create GRB discussion and add to intake as admin", func() {
		emailClient, _ := NewEmailClient()

		intake := s.createNewIntake()
		ctx, _ := s.getTestContextWithPrincipal("ABCD", true)
		s.createGRBDiscussion(
			ctx,
			emailClient,
			intake.ID,
			"<p>banana</p>",
		)

	})

	s.Run("create GRB discussion and add to intake as reviewer", func() {
		emailClient, _ := NewEmailClient()

		intake, _ := s.createIntakeAndAddReviewersByEUAs("ABCD")

		ctx, _ := s.getTestContextWithPrincipal("ABCD", false)
		s.createGRBDiscussion(
			ctx,
			emailClient,
			intake.ID,
			"<p>banana</p>",
		)
	})

	s.Run("cannot create GRB discussion if not reviewer or admin", func() {
		emailClient, _ := NewEmailClient()

		intake := s.createNewIntake()
		ctx, _ := s.getTestContextWithPrincipal("ABCD", false)
		post, err := CreateSystemIntakeGRBDiscussionPost(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionPostInput{
				SystemIntakeID: intake.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>banana</p>",
				},
				DiscussionBoardType: models.SystemIntakeGRBDiscussionBoardTypePrimary,
			},
		)
		s.Nil(post)
		s.Error(err)
	})

	s.Run("tagged reviewers should receive an email", func() {
		emailClient, sender := NewEmailClient()

		intake, _ := s.createIntakeAndAddReviewersByEUAs("ABCD", "BTMN", "USR2")

		ctx, _ := s.getTestContextWithPrincipal("ABCD", false)
		content := "<p>banana</p>"

		usersToEmail := s.getOrCreateUserAccts("BTMN", "USR2")
		for _, user := range usersToEmail {
			content = addTags(
				content,
				models.Tag{
					TagType:         models.TagTypeUserAccount,
					TaggedContentID: user.ID,
				},
			)
		}

		s.createGRBDiscussion(
			ctx,
			emailClient,
			intake.ID,
			content,
		)

		s.Len(sender.sentEmails, 1)
		s.Equal(sender.subject, fmt.Sprintf("You were tagged in a GRB Review discussion for %s", intake.ProjectName.String))
		// should exclude ABCD as author of reply
		s.Len(sender.bccAddresses, 2)
		for _, user := range usersToEmail {
			s.Contains(sender.bccAddresses, models.EmailAddress(user.Email))
		}
	})

	s.Run("tagging groups should send emails", func() {
		emailClient, sender := NewEmailClient()

		intake, _ := s.createIntakeAndAddReviewersByEUAs("ABCD", "BTMN", "USR2")

		ctx, _ := s.getTestContextWithPrincipal("ABCD", false)
		content := "<p>banana</p>"

		// author should be excluded from emails
		reviewerAccts := s.getOrCreateUserAccts("BTMN", "USR2")

		content = addTags(
			content,
			models.Tag{
				TagType: models.TagTypeGroupGrbReviewers,
			},
			models.Tag{
				TagType: models.TagTypeGroupItGov,
			},
		)

		s.createGRBDiscussion(
			ctx,
			emailClient,
			intake.ID,
			content,
		)

		s.Len(sender.sentEmails, 2)
		grtEmail, found := lo.Find(sender.sentEmails, func(email email.Email) bool {
			return email.Subject == fmt.Sprintf("The Governance Admin Team was tagged in a GRB Review discussion for %s", intake.ProjectName.String)
		})
		s.True(found)
		s.Len(grtEmail.CcAddresses, 1)
		s.Equal(grtEmail.CcAddresses[0], getTestEmailConfig().GRTEmail)

		grbEmail, found := lo.Find(sender.sentEmails, func(email email.Email) bool {
			return email.Subject == fmt.Sprintf("The GRB was tagged in a GRB Review discussion for %s", intake.ProjectName.String)
		})

		s.True(found)
		s.NotNil(grbEmail)
		// should exclude ABCD as author of reply
		s.Len(grbEmail.BccAddresses, len(reviewerAccts))
		for _, user := range reviewerAccts {
			s.Contains(grbEmail.BccAddresses, models.EmailAddress(user.Email))
		}
	})

	s.Run("create GRB discussion on completed intake", func() {
		emailClient, _ := NewEmailClient()

		intake := s.createNewIntake()
		intake.GrbReviewAsyncManualEndDate = helpers.PointerTo(time.Now().Add(time.Hour * -24))
		intake, err := s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, intake)
		s.NoError(err)

		ctx, _ := s.getTestContextWithPrincipal("ABCD", true)
		s.createGRBDiscussionWithExpectedError(
			ctx,
			emailClient,
			intake.ID,
			"<p>banana</p>",
		)
	})
}

func (s *ResolverSuite) TestSystemIntakeGRBDiscussionReplies() {
	store := s.testConfigs.Store

	s.Run("reply to GRB discussion as admin", func() {
		emailClient, _ := NewEmailClient()

		intake := s.createNewIntake()

		ctx, princ := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a newerDiscussion</p>")

		replyPost := s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussionPost,
			"<p>banana</p>",
		)

		replyPost2 := s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussionPost,
			"<p>apple</p>",
		)

		discussionPost2 := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a newer newerDiscussion</p>")

		// fetch newerDiscussion using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, intake.ID, models.SystemIntakeGRBDiscussionBoardTypePrimary)
		s.NoError(err)
		s.NotNil(discussions)
		s.Len(discussions, 2)
		newerDiscussion := discussions[0]
		// confirm the newer newerDiscussion is first
		s.Equal(newerDiscussion.InitialPost.ID, discussionPost2.ID)

		olderDiscussion := discussions[1]

		// test newerDiscussion reply from resolver
		s.Len(newerDiscussion.Replies, 0) // the newest has no replies
		s.Len(olderDiscussion.Replies, 2) // the first one has two replies
		reply := olderDiscussion.Replies[0]
		s.Equal(reply.ID, replyPost.ID) // confirm oldest reply is first
		reply2 := olderDiscussion.Replies[1]
		s.Equal(reply2.ID, replyPost2.ID) // confirm newest reply is second
		s.Equal(princ.UserAccount.ID, reply.CreatedBy)
		s.NotNil(reply.ReplyToID)

		s.Equal(olderDiscussion.InitialPost.ID, *reply.ReplyToID)
		s.Equal(reply.Content, models.HTML("<p>banana</p>"))
	})

	s.Run("reply to GRB discussion as reviewer", func() {
		emailClient, _ := NewEmailClient()

		intake, _ := s.createIntakeAndAddReviewersByEUAs("BTMN")

		ctx, discAuthor := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		ctx, replyAuthor := s.getTestContextWithPrincipal("BTMN", false)
		replyPost := s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussionPost,
			"<p>banana</p>",
		)

		// fetch discussion using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, intake.ID, models.SystemIntakeGRBDiscussionBoardTypePrimary)
		s.NoError(err)
		s.NotNil(discussions)
		s.Len(discussions, 1)
		discussion := discussions[0]
		s.Equal(discussion.InitialPost.ID, discussionPost.ID)
		s.Equal(discussion.InitialPost.CreatedBy, discAuthor.UserAccount.ID)

		// test discussion reply from resolver
		s.Len(discussions[0].Replies, 1)
		reply := discussions[0].Replies[0]
		s.Equal(reply.ID, replyPost.ID)
		s.Equal(replyAuthor.UserAccount.ID, reply.CreatedBy)
		s.NotNil(reply.ReplyToID)
		s.Equal(discussion.InitialPost.ID, *reply.ReplyToID)
		s.Equal(reply.Content, models.HTML("<p>banana</p>"))
	})

	s.Run("should not allow reply to GRB discussion when not reviewer nor admin", func() {
		emailClient, _ := NewEmailClient()

		intake := s.createNewIntake()

		ctx, discAuthor := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		ctx, _ = s.getTestContextWithPrincipal("USR2", false)
		replyPost, err := CreateSystemIntakeGRBDiscussionReply(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionReplyInput{
				InitialPostID: discussionPost.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>banana</p>",
				},
				DiscussionBoardType: models.SystemIntakeGRBDiscussionBoardTypePrimary,
			},
		)
		s.Nil(replyPost)
		s.Error(err)

		// fetch discussion using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, intake.ID, models.SystemIntakeGRBDiscussionBoardTypePrimary)
		s.NoError(err)
		s.NotNil(discussions)
		s.Len(discussions, 1)
		discussion := discussions[0]
		s.Equal(discussion.InitialPost.ID, discussionPost.ID)
		s.Equal(discussion.InitialPost.CreatedBy, discAuthor.UserAccount.ID)

		// discussion should have no replies
		s.Len(discussions[0].Replies, 0)
	})

	s.Run("Should allow for multiple replies", func() {
		emailClient, _ := NewEmailClient()

		intake, _ := s.createIntakeAndAddReviewersByEUAs("BTMN", "ABCD")

		ctx, discAuthor := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		ctx, reply1Author := s.getTestContextWithPrincipal("BTMN", false)
		reply1Post := s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussionPost,
			"<p>banana</p>",
		)

		ctx, reply2Author := s.getTestContextWithPrincipal("ABCD", false)
		reply2Post := s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussionPost,
			"<p>tangerine</p>",
		)

		// fetch discussion using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, intake.ID, models.SystemIntakeGRBDiscussionBoardTypePrimary)
		s.NoError(err)
		s.NotNil(discussions)
		s.Len(discussions, 1)
		discussion := discussions[0]
		s.Equal(discussion.InitialPost.ID, discussionPost.ID)
		s.Equal(discussion.InitialPost.CreatedBy, discAuthor.UserAccount.ID)

		// test replies
		s.Len(discussions[0].Replies, 2)

		reply1 := discussions[0].Replies[0]
		s.Equal(reply1Post.ID, reply1.ID)
		s.Equal(reply1Author.UserAccount.ID, reply1.CreatedBy)
		s.NotNil(reply1.ReplyToID)
		s.Equal(discussion.InitialPost.ID, *reply1.ReplyToID)
		s.Equal(reply1.Content, models.HTML("<p>banana</p>"))

		reply2 := discussions[0].Replies[1]
		s.Equal(reply2Post.ID, reply2.ID)
		s.Equal(reply2Author.UserAccount.ID, reply2.CreatedBy)
		s.NotNil(reply2.ReplyToID)
		s.Equal(discussion.InitialPost.ID, *reply2.ReplyToID)
		s.Equal(reply2.Content, models.HTML("<p>tangerine</p>"))
	})

	s.Run("Should allow for replies on different discussions", func() {
		emailClient, _ := NewEmailClient()

		intake, _ := s.createIntakeAndAddReviewersByEUAs("BTMN", "ABCD")

		// create two discussions
		ctx, disc1Author := s.getTestContextWithPrincipal("USR1", true)
		discussion1Post := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		ctx, disc2Author := s.getTestContextWithPrincipal("USR2", true)
		discussion2Post := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a second discussion</p>")

		// reply to the first discussion
		ctx, reply1Author := s.getTestContextWithPrincipal("BTMN", false)
		reply1Post := s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussion1Post,
			"<p>banana</p>",
		)

		// reply to the second discussion
		ctx, reply2Author := s.getTestContextWithPrincipal("ABCD", false)
		reply2Post := s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussion2Post,
			"<p>tangerine</p>",
		)

		// fetch discussions using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, intake.ID, models.SystemIntakeGRBDiscussionBoardTypePrimary)
		s.NoError(err)
		s.NotNil(discussions)
		s.Len(discussions, 2)
		newerDiscussion := discussions[0]
		olderDiscussion := discussions[1]
		s.Equal(olderDiscussion.InitialPost.ID, discussion1Post.ID)
		s.Equal(newerDiscussion.InitialPost.ID, discussion2Post.ID)
		s.Equal(olderDiscussion.InitialPost.CreatedBy, disc1Author.UserAccount.ID)
		s.Equal(newerDiscussion.InitialPost.CreatedBy, disc2Author.UserAccount.ID)

		// test each discussion's reply
		s.Len(newerDiscussion.Replies, 1)
		s.Len(olderDiscussion.Replies, 1)

		reply1 := olderDiscussion.Replies[0]
		s.Equal(reply1.ID, reply1Post.ID)
		s.Equal(reply1Author.UserAccount.ID, reply1.CreatedBy)
		s.NotNil(reply1.ReplyToID)
		s.Equal(olderDiscussion.InitialPost.ID, *reply1.ReplyToID)
		s.Equal(reply1.Content, models.HTML("<p>banana</p>"))

		reply2 := newerDiscussion.Replies[0]
		s.Equal(reply2.ID, reply2Post.ID)
		s.Equal(reply2Author.UserAccount.ID, reply2.CreatedBy)
		s.NotNil(reply2.ReplyToID)
		s.Equal(newerDiscussion.InitialPost.ID, *reply2.ReplyToID)
		s.Equal(reply2.Content, models.HTML("<p>tangerine</p>"))
	})

	s.Run("replies should email discussion author", func() {
		emailClient, sender := NewEmailClient()

		intake := s.createNewIntake()

		ctx, discussionAuthor := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		ctx, _ = s.getTestContextWithPrincipal("USR2", true)
		s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussionPost,
			"<p>banana</p>",
		)

		s.True(sender.emailWasSent)
		s.Len(sender.toAddresses, 1)
		s.Equal(discussionAuthor.Account().Email, sender.toAddresses[0].String())
	})

	s.Run("author replies should NOT email discussion author", func() {
		emailClient, sender := NewEmailClient()

		intake := s.createNewIntake()

		ctx, _ := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussionPost,
			"<p>banana</p>",
		)

		s.False(sender.emailWasSent)
	})

	s.Run("individual tags in replies should send an email to those users", func() {
		emailClient, sender := NewEmailClient()

		intake, _ := s.createIntakeAndAddReviewersByEUAs("USR1", "BTMN", "ABCD")

		ctx, _ := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		replyContent := "<p>banana</p>"
		usersToEmail := s.getOrCreateUserAccts("BTMN", "ABCD")
		for _, user := range usersToEmail {
			replyContent = addTags(
				replyContent,
				models.Tag{
					TagType:         models.TagTypeUserAccount,
					TaggedContentID: user.ID,
				},
			)
		}
		s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussionPost,
			replyContent,
		)

		s.True(sender.emailWasSent)
		s.Equal(sender.subject, fmt.Sprintf("You were tagged in a GRB Review discussion for %s", intake.ProjectName.String))
		// should exclude ABCD as author of reply and initial discussion post
		s.Len(sender.bccAddresses, 2)
		for _, user := range usersToEmail {
			s.Contains(sender.bccAddresses, models.EmailAddress(user.Email))
		}
	})
	s.Run("tagging groups in replies should send emails", func() {
		emailClient, sender := NewEmailClient()

		intake, _ := s.createIntakeAndAddReviewersByEUAs("ABCD", "BTMN", "USR2")

		ctx, _ := s.getTestContextWithPrincipal("ABCD", false)
		content := "<p>banana</p>"
		discussionPost := s.createGRBDiscussion(
			ctx,
			emailClient,
			intake.ID,
			content,
		)

		// author should be excluded from emails
		reviewerAccts := s.getOrCreateUserAccts("BTMN", "USR2")

		content = addTags(
			content,
			models.Tag{
				TagType: models.TagTypeGroupGrbReviewers,
			},
			models.Tag{
				TagType: models.TagTypeGroupItGov,
			},
		)
		s.createGRBDiscussionReply(
			ctx,
			emailClient,
			discussionPost,
			content,
		)

		// should not send reply email as initial post and reply share an author
		s.Len(sender.sentEmails, 2)
		grtEmail, found := lo.Find(sender.sentEmails, func(email email.Email) bool {
			return email.Subject == fmt.Sprintf("The Governance Admin Team was tagged in a GRB Review discussion for %s", intake.ProjectName.String)
		})
		s.True(found)
		s.Len(grtEmail.CcAddresses, 1)
		s.Equal(grtEmail.CcAddresses[0], getTestEmailConfig().GRTEmail)

		grbEmail, found := lo.Find(sender.sentEmails, func(email email.Email) bool {
			return email.Subject == fmt.Sprintf("The GRB was tagged in a GRB Review discussion for %s", intake.ProjectName.String)
		})

		s.True(found)
		s.NotNil(grbEmail)
		// should exclude ABCD as author of reply
		s.Len(grbEmail.BccAddresses, len(reviewerAccts))
		for _, user := range reviewerAccts {
			s.Contains(grbEmail.BccAddresses, models.EmailAddress(user.Email))
		}
	})

	// Test replying on a complete system intake
	s.Run("reply to GRB discussion on complete intake", func() {
		emailClient, _ := NewEmailClient()

		intake := s.createNewIntake()

		ctx, _ := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := s.createGRBDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		intake.GrbReviewAsyncManualEndDate = helpers.PointerTo(time.Now().Add(time.Hour * -24))
		intake, err := s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, intake)
		s.NoError(err)

		s.createGRBDiscussionReplyWithExpectedError(
			ctx,
			emailClient,
			discussionPost,
			"<p>banana</p>",
		)
	})
}

// helper to create a discussion
func (s *ResolverSuite) createGRBDiscussion(
	ctx context.Context,
	emailClient *email.Client,
	intakeID uuid.UUID,
	content string,
) *models.SystemIntakeGRBReviewDiscussionPost {
	taggedHTMLContent, err := models.NewTaggedHTMLFromString(content)
	s.NoError(err)
	discussion, err := CreateSystemIntakeGRBDiscussionPost(
		ctx,
		s.testConfigs.Store,
		emailClient,
		models.CreateSystemIntakeGRBDiscussionPostInput{
			SystemIntakeID:      intakeID,
			Content:             taggedHTMLContent,
			DiscussionBoardType: models.SystemIntakeGRBDiscussionBoardTypePrimary,
		},
	)

	s.NoError(err)
	s.NotNil(discussion)
	s.NotNil(discussion.ID)
	s.Nil(discussion.ReplyToID)
	s.Equal(discussion.Content, models.HTML(content))
	s.Equal(discussion.SystemIntakeID, intakeID)

	return discussion
}

// helper to create a discussion
func (s *ResolverSuite) createGRBDiscussionWithExpectedError(
	ctx context.Context,
	emailClient *email.Client,
	intakeID uuid.UUID,
	content string,
) *models.SystemIntakeGRBReviewDiscussionPost {
	taggedHTMLContent, err := models.NewTaggedHTMLFromString(content)
	s.NoError(err)
	discussion, err := CreateSystemIntakeGRBDiscussionPost(
		ctx,
		s.testConfigs.Store,
		emailClient,
		models.CreateSystemIntakeGRBDiscussionPostInput{
			SystemIntakeID:      intakeID,
			Content:             taggedHTMLContent,
			DiscussionBoardType: models.SystemIntakeGRBDiscussionBoardTypePrimary,
		},
	)

	s.Error(err)
	s.Nil(discussion)

	return discussion
}

func (s *ResolverSuite) createGRBDiscussionReply(
	ctx context.Context,
	emailClient *email.Client,
	discussionPost *models.SystemIntakeGRBReviewDiscussionPost,
	content string,
) *models.SystemIntakeGRBReviewDiscussionPost {
	taggedHTMLContent, err := models.NewTaggedHTMLFromString(content)
	s.NoError(err)
	replyPost, err := CreateSystemIntakeGRBDiscussionReply(
		ctx,
		s.testConfigs.Store,
		emailClient,
		models.CreateSystemIntakeGRBDiscussionReplyInput{
			InitialPostID:       discussionPost.ID,
			Content:             taggedHTMLContent,
			DiscussionBoardType: models.SystemIntakeGRBDiscussionBoardTypePrimary,
		},
	)
	// test returned reply post
	s.NotNil(replyPost)
	s.NoError(err)
	s.Equal(replyPost.Content, models.HTML(content))
	s.Equal(replyPost.SystemIntakeID, discussionPost.SystemIntakeID)
	s.Equal(appcontext.Principal(ctx).Account().ID, replyPost.CreatedBy)
	s.NotNil(replyPost.ReplyToID)
	s.Equal(*replyPost.ReplyToID, discussionPost.ID)
	return replyPost
}

func (s *ResolverSuite) createGRBDiscussionReplyWithExpectedError(
	ctx context.Context,
	emailClient *email.Client,
	discussionPost *models.SystemIntakeGRBReviewDiscussionPost,
	content string,
) *models.SystemIntakeGRBReviewDiscussionPost {
	taggedHTMLContent, err := models.NewTaggedHTMLFromString(content)
	s.NoError(err)
	replyPost, err := CreateSystemIntakeGRBDiscussionReply(
		ctx,
		s.testConfigs.Store,
		emailClient,
		models.CreateSystemIntakeGRBDiscussionReplyInput{
			InitialPostID:       discussionPost.ID,
			Content:             taggedHTMLContent,
			DiscussionBoardType: models.SystemIntakeGRBDiscussionBoardTypePrimary,
		},
	)

	s.Error(err)
	s.Nil(replyPost)
	return replyPost
}

// helper to create an intake and add GRB reviewers at the same time
func (s *ResolverSuite) createIntakeAndAddReviewersByEUAs(reviewerEuaIDs ...string) (*models.SystemIntake, []*models.SystemIntakeGRBReviewer) {
	intake := s.createNewIntake()

	reviewers := []*models.CreateGRBReviewerInput{}
	for _, reviewerEUA := range reviewerEuaIDs {
		reviewers = append(reviewers, &models.CreateGRBReviewerInput{
			EuaUserID:  reviewerEUA,
			VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
			GrbRole:    models.SystemIntakeGRBReviewerRoleCoChairCfo,
		})
	}

	var createdReviewers []*models.SystemIntakeGRBReviewer
	if len(reviewers) > 0 {
		payload, err := CreateSystemIntakeGRBReviewers(
			s.testConfigs.Context,
			s.testConfigs.Store,
			nil, //email client
			userhelpers.GetUserInfoAccountInfosWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfos),
			&models.CreateSystemIntakeGRBReviewersInput{
				SystemIntakeID: intake.ID,
				Reviewers:      reviewers,
			},
		)
		s.NoError(err)
		s.Equal(len(payload.Reviewers), len(reviewerEuaIDs))
		createdReviewers = payload.Reviewers
	}
	return intake, createdReviewers
}

func addTags(htmlString string, tags ...models.Tag) string {
	for _, tag := range tags {
		span := fmt.Sprintf(`<span class="mention" tag-type="%s" data-type="mention"`, tag.TagType)
		if tag.TagType == models.TagTypeUserAccount {
			span += fmt.Sprintf(` data-id-db="%s"`, tag.TaggedContentID)
		}
		span += `>@tag</span>`
		htmlString += span
	}
	return htmlString
}
