package models

import (
	"github.com/google/uuid"
)

type SystemIntakeGRBReviewDiscussionPost struct {
	BaseStructUser
	Content        TaggedContent            `json:"content" db:"content"`
	SystemIntakeID uuid.UUID                `json:"systemIntakeId" db:"system_intake_id"`
	ReplyToID      *uuid.UUID               `db:"reply_to_id"`
	VotingRole     *SIGRBReviewerVotingRole `json:"votingRole" db:"voting_role"`
	GRBRole        *SIGRBReviewerRole       `json:"grbRole" db:"grb_role"`
}

func NewSystemIntakeGRBReviewDiscussion(createdBy uuid.UUID) *SystemIntakeGRBReviewDiscussionPost {
	return &SystemIntakeGRBReviewDiscussionPost{
		BaseStructUser: NewBaseStructUser(createdBy),
	}
}

func (r SystemIntakeGRBReviewDiscussionPost) GetMappingKey() uuid.UUID {
	return r.SystemIntakeID
}
func (r SystemIntakeGRBReviewDiscussionPost) GetMappingVal() *SystemIntakeGRBReviewDiscussionPost {
	return &r
}
