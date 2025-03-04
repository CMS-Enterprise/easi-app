package models

import (
	"github.com/google/uuid"
)

func (s *ModelTestSuite) TestSystemIntakeGRBDiscussionsHelpers() {
	createdByID := uuid.New()

	// initial post
	post1 := NewSystemIntakeGRBReviewDiscussionPost(createdByID)
	post1ID := uuid.New()
	post1.ID = post1ID

	// replies
	post1reply1 := NewSystemIntakeGRBReviewDiscussionPost(createdByID)
	post1reply1ID := uuid.New()
	post1reply1.ID = post1reply1ID
	post1reply1.ReplyToID = &post1ID
	post1reply2 := NewSystemIntakeGRBReviewDiscussionPost(createdByID)
	post1reply2ID := uuid.New()
	post1reply2.ID = post1reply2ID
	post1reply2.ReplyToID = &post1ID

	// initial post
	post2 := NewSystemIntakeGRBReviewDiscussionPost(createdByID)
	post2ID := uuid.New()
	post2.ID = post2ID

	// replies
	post2reply1 := NewSystemIntakeGRBReviewDiscussionPost(createdByID)
	post2reply1ID := uuid.New()
	post2reply1.ID = post2reply1ID
	post2reply1.ReplyToID = &post2ID
	post2reply2 := NewSystemIntakeGRBReviewDiscussionPost(createdByID)
	post2reply2ID := uuid.New()
	post2reply2.ID = post2reply2ID
	post2reply2.ReplyToID = &post2ID

	s.Run("CreateGRBDiscussionsFromPosts should sort initial posts and replies", func() {
		// randomized order to reflect the possibility of posts not coming sorted from db
		posts := []*SystemIntakeGRBReviewDiscussionPost{
			post2,
			post1reply1,
			post1,
			post1reply2,
			post2reply2,
			post2reply1,
		}

		discussions, err := CreateGRBDiscussionsFromPosts(posts)
		s.NoError(err)

		s.NotNil(discussions)
		s.Len(discussions, 2)

		// first discussion tests
		oldestDiscussion := discussions[1]
		s.EqualValues(
			oldestDiscussion.InitialPost.ID,
			post1ID,
			"first discussion should be sorted as first item in slice",
		)

		// replies to first discussion
		s.Len(oldestDiscussion.Replies, 2)

		firstDiscFirstReply := oldestDiscussion.Replies[0]
		s.EqualValues(
			firstDiscFirstReply.ID,
			post1reply1ID,
			"first reply to first discussion should be sorted as first reply",
		)
		s.NotNil(firstDiscFirstReply.ReplyToID)
		s.EqualValues(
			*firstDiscFirstReply.ReplyToID,
			post1ID,
			"first reply to first discussion should have replyToID of first discussion post",
		)

		firstDiscSecondReply := oldestDiscussion.Replies[1]
		s.EqualValues(
			firstDiscSecondReply.ID,
			post1reply2ID,
			"second reply to first discussion should be sorted as second reply",
		)
		s.NotNil(firstDiscSecondReply.ReplyToID)
		s.EqualValues(
			*firstDiscSecondReply.ReplyToID,
			post1ID,
			"second reply to first discussion should have replyToID of first discussion post",
		)

		// second discussion tests
		newestDiscussion := discussions[0]
		s.EqualValues(
			newestDiscussion.InitialPost.ID,
			post2ID,
			"second discussion should be sorted as second item in slice",
		)

		// replies to second discussion
		s.Len(newestDiscussion.Replies, 2)

		secondDiscFirstReply := newestDiscussion.Replies[0]
		s.EqualValues(
			secondDiscFirstReply.ID,
			post2reply1ID,
			"first reply to second discussion should be sorted as first reply",
		)
		s.NotNil(secondDiscFirstReply.ReplyToID)
		s.EqualValues(
			*secondDiscFirstReply.ReplyToID,
			post2ID,
			"first reply to second discussion should have replyToID of second discussion post",
		)

		secondDiscSecondReply := newestDiscussion.Replies[1]
		s.EqualValues(
			secondDiscSecondReply.ID,
			post2reply2ID,
			"second reply to second discussion should be sorted as second reply",
		)
		s.NotNil(secondDiscSecondReply.ReplyToID)
		s.EqualValues(
			*secondDiscSecondReply.ReplyToID,
			post2ID,
			"second reply to second discussion should have replyToID of second discussion post",
		)
	})

	s.Run("createGRBDiscussionFromPosts should sort initial posts and replies", func() {
		// randomized order to reflect the possibility of posts not coming sorted from db
		posts := []*SystemIntakeGRBReviewDiscussionPost{
			post1reply1,
			post1,
			post1reply2,
		}

		discussion, err := createGRBDiscussionFromPosts(posts)
		s.NoError(err)
		s.NotNil(discussion)

		s.EqualValues(
			discussion.InitialPost.ID,
			post1ID,
		)

		firstReply := discussion.Replies[0]
		s.EqualValues(
			firstReply.ID,
			post1reply1ID,
			"first reply to discussion should be sorted as first reply",
		)
		s.NotNil(firstReply.ReplyToID)
		s.EqualValues(
			*firstReply.ReplyToID,
			post1ID,
			"first reply to discussion should have replyToID of discussion post",
		)

		secondReply := discussion.Replies[1]
		s.EqualValues(
			secondReply.ID,
			post1reply2ID,
			"second reply to discussion should be sorted as second reply",
		)
		s.NotNil(secondReply.ReplyToID)
		s.EqualValues(
			*secondReply.ReplyToID,
			post1ID,
			"second reply to discussion should have replyToID of discussion post",
		)
	})

	s.Run("createGRBDiscussionFromPosts should error if two initial posts are found", func() {
		// randomized order to reflect the possibility of posts not coming sorted from db
		posts := []*SystemIntakeGRBReviewDiscussionPost{
			post2,
			post1reply1,
			post1,
			post1reply2,
			post2reply2,
			post2reply1,
		}

		discussion, err := createGRBDiscussionFromPosts(posts)
		s.Error(err)
		s.Nil(discussion)
	})

	s.Run("createGRBDiscussionFromPosts should error if no initial posts are found", func() {
		// randomized order to reflect the possibility of posts not coming sorted from db
		posts := []*SystemIntakeGRBReviewDiscussionPost{
			post1reply1,
			post1reply2,
			post2reply2,
			post2reply1,
		}

		discussion, err := createGRBDiscussionFromPosts(posts)
		s.Error(err)
		s.Nil(discussion)
	})

	s.Run("CreateGRBDiscussionsFromPosts should error if no initial posts are found", func() {
		// randomized order to reflect the possibility of posts not coming sorted from db
		posts := []*SystemIntakeGRBReviewDiscussionPost{
			post1reply1,
			post1reply2,
			post2reply2,
			post2reply1,
		}

		discussions, err := CreateGRBDiscussionsFromPosts(posts)
		s.Error(err)
		s.Nil(discussions)
	})
}
