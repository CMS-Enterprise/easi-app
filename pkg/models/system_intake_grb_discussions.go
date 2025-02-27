package models

import (
	"errors"
	"slices"

	"github.com/google/uuid"
)

type SystemIntakeGRBReviewDiscussionPost struct {
	BaseStructUser
	Content        HTML                               `json:"content" db:"content"`
	SystemIntakeID uuid.UUID                          `json:"systemIntakeId" db:"system_intake_id"`
	ReplyToID      *uuid.UUID                         `db:"reply_to_id"`
	VotingRole     *SystemIntakeGRBReviewerVotingRole `json:"votingRole" db:"voting_role"`
	GRBRole        *SystemIntakeGRBReviewerRole       `json:"grbRole" db:"grb_role"`
}

func NewSystemIntakeGRBReviewDiscussionPost(createdBy uuid.UUID) *SystemIntakeGRBReviewDiscussionPost {
	return &SystemIntakeGRBReviewDiscussionPost{
		BaseStructUser: NewBaseStructUser(createdBy),
	}
}

// CreateGRBDiscussionsFromPosts sorts a slice of discussion posts (replies and initial) and sorts them into multiple discussions
func CreateGRBDiscussionsFromPosts(posts []*SystemIntakeGRBReviewDiscussionPost) ([]*SystemIntakeGRBReviewDiscussion, error) {
	postMap := map[uuid.UUID][]*SystemIntakeGRBReviewDiscussionPost{}
	for _, post := range posts {
		// shouldn't happen but we deference below
		if post == nil {
			return nil, errors.New("post is nil")
		}
		// group posts into slices by the initial post id
		var groupingID uuid.UUID
		if post.ReplyToID != nil {
			groupingID = *post.ReplyToID
		} else {
			groupingID = post.ID
		}
		posts, ok := postMap[groupingID]
		if ok {
			postMap[groupingID] = append(posts, post)
		} else {
			postMap[groupingID] = []*SystemIntakeGRBReviewDiscussionPost{post}
		}
	}

	// after grouping by initial post ID, loop through slice of slices and convert groups of posts into discussions
	discussions := []*SystemIntakeGRBReviewDiscussion{}
	for _, posts := range postMap {
		groupedPosts, err := CreateGRBDiscussionFromPosts(posts)
		if err != nil {
			return nil, err
		}
		discussions = append(discussions, groupedPosts)
	}
	slices.SortFunc(discussions, func(a *SystemIntakeGRBReviewDiscussion, b *SystemIntakeGRBReviewDiscussion) int {
		return a.InitialPost.CreatedAt.Compare(b.InitialPost.CreatedAt)
	})
	return discussions, nil
}

// CreateGRBDiscussionFromPosts organizes a post and its replies into a single discussion
// (for slices with multiple initial posts/related replies use CreateGRBDiscussionsFromPosts)
func CreateGRBDiscussionFromPosts(posts []*SystemIntakeGRBReviewDiscussionPost) (*SystemIntakeGRBReviewDiscussion, error) {
	var discussion SystemIntakeGRBReviewDiscussion
	for _, post := range posts {
		if post.ReplyToID == nil {
			if discussion.InitialPost != nil {
				return nil, errors.New("posts must only contain one initial post")
			}
			discussion.InitialPost = post
		} else {
			discussion.Replies = append(discussion.Replies, post)
		}
	}
	if discussion.InitialPost == nil {
		return nil, errors.New("initial post not found")
	}
	slices.SortFunc(discussion.Replies, func(a *SystemIntakeGRBReviewDiscussionPost, b *SystemIntakeGRBReviewDiscussionPost) int {
		return a.CreatedAt.Compare(b.CreatedAt)
	})
	return &discussion, nil
}

func (r SystemIntakeGRBReviewDiscussionPost) GetMappingKey() uuid.UUID {
	return r.SystemIntakeID
}
func (r SystemIntakeGRBReviewDiscussionPost) GetMappingVal() *SystemIntakeGRBReviewDiscussionPost {
	return &r
}
