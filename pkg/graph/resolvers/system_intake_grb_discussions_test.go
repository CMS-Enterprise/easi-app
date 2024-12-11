package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func (s *ResolverSuite) TestSystemIntakeGRBDiscussions() {
	store := s.testConfigs.Store

	s.Run("create and retrieve initial discussion", func() {
		emailClient, _ := NewEmailClient()

		intake := s.createNewIntake()
		ctx, princ := s.getTestContextWithPrincipal("ABCD", true)
		post, err := CreateSystemIntakeGRBDiscussionPost(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionPostInput{
				SystemIntakeID: intake.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>banana</p>",
				},
			},
		)
		s.NotNil(post)
		s.NoError(err)
		s.Equal(post.Content, models.HTML("<p>banana</p>"))
		s.Equal(post.SystemIntakeID, intake.ID)
		s.Equal(princ.UserAccount.ID, post.CreatedBy)
		// initial discussions should have no reply ID
		s.Nil(post.ReplyToID)

		// test the resolver for retrieving discussions
		discussions, err := SystemIntakeGRBDiscussions(ctx, store, intake.ID)
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
		ctx, princ := s.getTestContextWithPrincipal("ABCD", true)
		post, err := CreateSystemIntakeGRBDiscussionPost(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionPostInput{
				SystemIntakeID: intake.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>banana</p>",
				},
			},
		)
		s.NotNil(post)
		s.NoError(err)
		s.Equal(post.Content, models.HTML("<p>banana</p>"))
		s.Equal(post.SystemIntakeID, intake.ID)
		s.Equal(princ.UserAccount.ID, post.CreatedBy)
		// initial discussions should have no reply ID
		s.Nil(post.ReplyToID)
	})

	s.Run("create GRB discussion and add to intake as reviewer", func() {
		emailClient, _ := NewEmailClient()

		intake := s.createNewIntake()

		_, err := CreateSystemIntakeGRBReviewers(
			s.testConfigs.Context,
			store,
			emailClient,
			userhelpers.GetUserInfoAccountInfosWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfos),
			&models.CreateSystemIntakeGRBReviewersInput{
				SystemIntakeID: intake.ID,
				Reviewers: []*models.CreateGRBReviewerInput{
					{
						EuaUserID:  "ABCD",
						VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
						GrbRole:    models.SystemIntakeGRBReviewerRoleCoChairCfo,
					},
				},
			},
		)
		s.NoError(err)

		ctx, princ := s.getTestContextWithPrincipal("ABCD", false)
		post, err := CreateSystemIntakeGRBDiscussionPost(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionPostInput{
				SystemIntakeID: intake.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>banana</p>",
				},
			},
		)
		s.NotNil(post)
		s.NoError(err)
		s.Equal(post.Content, models.HTML("<p>banana</p>"))
		s.Equal(post.SystemIntakeID, intake.ID)
		s.Equal(princ.UserAccount.ID, post.CreatedBy)
		// initial discussions should have no reply ID
		s.Nil(post.ReplyToID)
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
			},
		)
		s.Nil(post)
		s.Error(err)
	})
}

func (s *ResolverSuite) TestSystemIntakeGRBDiscussionReplies() {
	store := s.testConfigs.Store

	// helper to create an intake and add GRB reviewers at the same time
	createIntakeAndAddReviewers := func(reviewerEuaIDs ...string) *models.SystemIntake {
		intake := s.createNewIntake()

		reviewers := []*models.CreateGRBReviewerInput{}
		for _, reviewerEUA := range reviewerEuaIDs {
			reviewers = append(reviewers, &models.CreateGRBReviewerInput{
				EuaUserID:  reviewerEUA,
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleCoChairCfo,
			})
		}

		if len(reviewers) > 0 {
			_, err := CreateSystemIntakeGRBReviewers(
				s.testConfigs.Context,
				store,
				nil, //email client
				userhelpers.GetUserInfoAccountInfosWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfos),
				&models.CreateSystemIntakeGRBReviewersInput{
					SystemIntakeID: intake.ID,
					Reviewers:      reviewers,
				},
			)
			s.NoError(err)
		}
		return intake
	}

	// helper to create a discussion
	createDiscussion := func(
		ctx context.Context,
		emailClient *email.Client,
		intakeID uuid.UUID,
		content string,
	) *models.SystemIntakeGRBReviewDiscussionPost {
		discussion, err := CreateSystemIntakeGRBDiscussionPost(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionPostInput{
				SystemIntakeID: intakeID,
				Content: models.TaggedHTML{
					RawContent: models.HTML(content),
				},
			},
		)
		s.NotNil(discussion)
		s.NoError(err)
		s.Equal(discussion.Content, models.HTML(content))
		s.Equal(discussion.SystemIntakeID, intakeID)
		s.NotNil(discussion.ID)
		s.Nil(discussion.ReplyToID)
		return discussion
	}

	s.Run("reply to GRB discussion as admin", func() {
		emailClient, _ := NewEmailClient()

		intake := createIntakeAndAddReviewers()

		ctx, princ := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := createDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		replyPost, err := CreateSystemIntakeGRBDiscussionReply(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionReplyInput{
				InitialPostID: discussionPost.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>banana</p>",
				},
			},
		)
		// test returned reply post
		s.NotNil(replyPost)
		s.NoError(err)
		s.Equal(replyPost.Content, models.HTML("<p>banana</p>"))
		s.Equal(replyPost.SystemIntakeID, intake.ID)
		s.Equal(princ.UserAccount.ID, replyPost.CreatedBy)
		s.NotNil(replyPost.ReplyToID)
		s.Equal(*replyPost.ReplyToID, discussionPost.ID)

		// fetch discussion using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, store, intake.ID)
		s.NoError(err)
		s.NotNil(discussions)
		s.Len(discussions, 1)
		discussion := discussions[0]
		s.Equal(discussion.InitialPost.ID, discussionPost.ID)

		// test discussion reply from resolver
		s.Len(discussions[0].Replies, 1)
		reply := discussions[0].Replies[0]
		s.Equal(princ.UserAccount.ID, reply.CreatedBy)
		s.NotNil(reply.ReplyToID)
		s.Equal(discussion.InitialPost.ID, *reply.ReplyToID)
		s.Equal(reply.Content, models.HTML("<p>banana</p>"))
	})

	s.Run("reply to GRB discussion as reviewer", func() {
		emailClient, _ := NewEmailClient()

		intake := createIntakeAndAddReviewers("BTMN")

		ctx, discAuthor := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := createDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		ctx, replyAuthor := s.getTestContextWithPrincipal("BTMN", false)
		replyPost, err := CreateSystemIntakeGRBDiscussionReply(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionReplyInput{
				InitialPostID: discussionPost.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>banana</p>",
				},
			},
		)
		// test returned reply post
		s.NotNil(replyPost)
		s.NoError(err)
		s.Equal(replyPost.Content, models.HTML("<p>banana</p>"))
		s.Equal(replyPost.SystemIntakeID, intake.ID)
		s.Equal(replyAuthor.UserAccount.ID, replyPost.CreatedBy)
		s.NotNil(replyPost.ReplyToID)
		s.Equal(*replyPost.ReplyToID, discussionPost.ID)

		// fetch discussion using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, store, intake.ID)
		s.NoError(err)
		s.NotNil(discussions)
		s.Len(discussions, 1)
		discussion := discussions[0]
		s.Equal(discussion.InitialPost.ID, discussionPost.ID)
		s.Equal(discussion.InitialPost.CreatedBy, discAuthor.UserAccount.ID)

		// test discussion reply from resolver
		s.Len(discussions[0].Replies, 1)
		reply := discussions[0].Replies[0]
		s.Equal(replyAuthor.UserAccount.ID, reply.CreatedBy)
		s.NotNil(reply.ReplyToID)
		s.Equal(discussion.InitialPost.ID, *reply.ReplyToID)
		s.Equal(reply.Content, models.HTML("<p>banana</p>"))
	})

	s.Run("should not allow reply to GRB discussion when not reviewer nor admin", func() {
		emailClient, _ := NewEmailClient()

		intake := createIntakeAndAddReviewers()

		ctx, discAuthor := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := createDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

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
			},
		)
		s.Nil(replyPost)
		s.Error(err)

		// fetch discussion using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, store, intake.ID)
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

		intake := createIntakeAndAddReviewers("BTMN", "ABCD")

		ctx, discAuthor := s.getTestContextWithPrincipal("USR1", true)
		discussionPost := createDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		ctx, reply1Author := s.getTestContextWithPrincipal("BTMN", false)
		reply1Post, err := CreateSystemIntakeGRBDiscussionReply(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionReplyInput{
				InitialPostID: discussionPost.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>banana</p>",
				},
			},
		)
		s.NotNil(reply1Post)
		s.NoError(err)
		s.Equal(reply1Post.Content, models.HTML("<p>banana</p>"))
		s.Equal(reply1Post.SystemIntakeID, intake.ID)
		s.Equal(reply1Author.UserAccount.ID, reply1Post.CreatedBy)
		s.NotNil(reply1Post.ReplyToID)
		s.Equal(*reply1Post.ReplyToID, discussionPost.ID)

		ctx, reply2Author := s.getTestContextWithPrincipal("ABCD", false)
		reply2Post, err := CreateSystemIntakeGRBDiscussionReply(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionReplyInput{
				InitialPostID: discussionPost.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>tangerine</p>",
				},
			},
		)
		// test reply from mutation
		s.NotNil(reply2Post)
		s.NoError(err)
		s.Equal(reply2Post.Content, models.HTML("<p>tangerine</p>"))
		s.Equal(reply2Post.SystemIntakeID, intake.ID)
		s.Equal(reply2Author.UserAccount.ID, reply2Post.CreatedBy)
		s.NotNil(reply2Post.ReplyToID)
		s.Equal(*reply2Post.ReplyToID, discussionPost.ID)

		// fetch discussion using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, store, intake.ID)
		s.NoError(err)
		s.NotNil(discussions)
		s.Len(discussions, 1)
		discussion := discussions[0]
		s.Equal(discussion.InitialPost.ID, discussionPost.ID)
		s.Equal(discussion.InitialPost.CreatedBy, discAuthor.UserAccount.ID)

		// test replies
		s.Len(discussions[0].Replies, 2)

		reply1 := discussions[0].Replies[0]
		s.Equal(reply1Author.UserAccount.ID, reply1.CreatedBy)
		s.NotNil(reply1.ReplyToID)
		s.Equal(discussion.InitialPost.ID, *reply1.ReplyToID)
		s.Equal(reply1.Content, models.HTML("<p>banana</p>"))

		reply2 := discussions[0].Replies[1]
		s.Equal(reply2Author.UserAccount.ID, reply2.CreatedBy)
		s.NotNil(reply2.ReplyToID)
		s.Equal(discussion.InitialPost.ID, *reply2.ReplyToID)
		s.Equal(reply2.Content, models.HTML("<p>tangerine</p>"))
	})

	s.Run("Should allow for replies on different discussions", func() {
		emailClient, _ := NewEmailClient()

		intake := createIntakeAndAddReviewers("BTMN", "ABCD")

		// create two discussions
		ctx, disc1Author := s.getTestContextWithPrincipal("USR1", true)
		discussion1Post := createDiscussion(ctx, emailClient, intake.ID, "<p>this is a discussion</p>")

		ctx, disc2Author := s.getTestContextWithPrincipal("USR2", true)
		discussion2Post := createDiscussion(ctx, emailClient, intake.ID, "<p>this is a second discussion</p>")

		// reply to the first discussion
		ctx, reply1Author := s.getTestContextWithPrincipal("BTMN", false)
		reply1Post, err := CreateSystemIntakeGRBDiscussionReply(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionReplyInput{
				InitialPostID: discussion1Post.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>banana</p>",
				},
			},
		)
		s.NotNil(reply1Post)
		s.NoError(err)
		s.Equal(reply1Post.Content, models.HTML("<p>banana</p>"))
		s.Equal(reply1Post.SystemIntakeID, intake.ID)
		s.Equal(reply1Author.UserAccount.ID, reply1Post.CreatedBy)
		s.NotNil(reply1Post.ReplyToID)
		s.Equal(*reply1Post.ReplyToID, discussion1Post.ID)

		// reply to the second discussion
		ctx, reply2Author := s.getTestContextWithPrincipal("ABCD", false)
		reply2Post, err := CreateSystemIntakeGRBDiscussionReply(
			ctx,
			store,
			emailClient,
			models.CreateSystemIntakeGRBDiscussionReplyInput{
				InitialPostID: discussion2Post.ID,
				Content: models.TaggedHTML{
					RawContent: "<p>tangerine</p>",
				},
			},
		)
		s.NotNil(reply2Post)
		s.NoError(err)
		s.Equal(reply2Post.Content, models.HTML("<p>tangerine</p>"))
		s.Equal(reply2Post.SystemIntakeID, intake.ID)
		s.Equal(reply2Author.UserAccount.ID, reply2Post.CreatedBy)
		s.NotNil(reply2Post.ReplyToID)
		s.Equal(*reply2Post.ReplyToID, discussion2Post.ID)

		// fetch discussions using resolver
		discussions, err := SystemIntakeGRBDiscussions(ctx, store, intake.ID)
		s.NoError(err)
		s.NotNil(discussions)
		s.Len(discussions, 2)
		discussion1 := discussions[0]
		discussion2 := discussions[1]
		s.Equal(discussion1.InitialPost.ID, discussion1Post.ID)
		s.Equal(discussion2.InitialPost.ID, discussion2Post.ID)
		s.Equal(discussion1.InitialPost.CreatedBy, disc1Author.UserAccount.ID)
		s.Equal(discussion2.InitialPost.CreatedBy, disc2Author.UserAccount.ID)

		// test each discussion's reply
		s.Len(discussions[0].Replies, 1)
		s.Len(discussions[1].Replies, 1)

		reply1 := discussion1.Replies[0]
		s.Equal(reply1Author.UserAccount.ID, reply1.CreatedBy)
		s.NotNil(reply1.ReplyToID)
		s.Equal(discussion1.InitialPost.ID, *reply1.ReplyToID)
		s.Equal(reply1.Content, models.HTML("<p>banana</p>"))

		reply2 := discussion2.Replies[0]
		s.Equal(reply2Author.UserAccount.ID, reply2.CreatedBy)
		s.NotNil(reply2.ReplyToID)
		s.Equal(discussion2.InitialPost.ID, *reply2.ReplyToID)
		s.Equal(reply2.Content, models.HTML("<p>tangerine</p>"))
	})
}
