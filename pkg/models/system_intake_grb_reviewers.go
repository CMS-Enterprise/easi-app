package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

func (r SystemIntakeGRBReviewerVotingRole) Humanize() (string, error) {
	var grbVotingRoleTranslationsMap = map[SystemIntakeGRBReviewerVotingRole]string{
		SystemIntakeGRBReviewerVotingRoleVoting:    "Voting",
		SystemIntakeGRBReviewerVotingRoleNonVoting: "Non-voting",
		SystemIntakeGRBReviewerVotingRoleAlternate: "Alternate",
	}
	translation, ok := grbVotingRoleTranslationsMap[r]
	if !ok {
		return "", fmt.Errorf("%s is not a valid SIGRBReviewerVotingRole", r)
	}
	return translation, nil
}

func (r SystemIntakeGRBReviewerRole) Humanize() (string, error) {
	var grbRoleTranslationsMap = map[SystemIntakeGRBReviewerRole]string{
		SystemIntakeGRBReviewerRoleCoChairCio:                "Co-Chair - CIO",
		SystemIntakeGRBReviewerRoleCoChairCfo:                "CO-Chair - CFO",
		SystemIntakeGRBReviewerRoleCoChairHca:                "CO-Chair - HCA",
		SystemIntakeGRBReviewerRoleAca3021Rep:                "ACA 3021 Rep",
		SystemIntakeGRBReviewerRoleCciioRep:                  "CCIIO Rep",
		SystemIntakeGRBReviewerRoleProgramOperationsBdgChair: "Program Operations BDG Chair",
		SystemIntakeGRBReviewerRoleCmcsRep:                   "CMCS Rep",
		SystemIntakeGRBReviewerRoleFedAdminBdgChair:          "Fed Admin BDG Chair",
		SystemIntakeGRBReviewerRoleProgramIntegrityBdgChair:  "Program Integrity BDG Chair",
		SystemIntakeGRBReviewerRoleQioRep:                    "QIO Rep",
		SystemIntakeGRBReviewerRoleSubjectMatterExpert:       "Subject Matter Expert (SME)",
		SystemIntakeGRBReviewerRoleOther:                     "Other",
	}
	translation, ok := grbRoleTranslationsMap[r]
	if !ok {
		return "", fmt.Errorf("%s is not a valid SIGRBReviewerRole", r)
	}
	return translation, nil
}

// SystemIntakeGRBReviewer describes
type SystemIntakeGRBReviewer struct {
	BaseStructUser
	userIDRelation
	SystemIntakeID  uuid.UUID                         `json:"systemIntakeId" db:"system_intake_id"`
	GRBVotingRole   SystemIntakeGRBReviewerVotingRole `json:"votingRole" db:"voting_role"`
	GRBReviewerRole SystemIntakeGRBReviewerRole       `json:"grbRole" db:"grb_role"`
	Vote            *SystemIntakeAsyncGRBVotingOption `json:"vote" db:"vote"`
	VoteComment     zero.String                       `json:"voteComment" db:"vote_comment"`
	DateVoted       zero.Time                         `json:"dateVoted" db:"date_voted"`
}

func NewSystemIntakeGRBReviewer(userID uuid.UUID, createdBy uuid.UUID) *SystemIntakeGRBReviewer {
	return &SystemIntakeGRBReviewer{
		BaseStructUser: NewBaseStructUser(createdBy),
		userIDRelation: NewUserIDRelation(userID),
	}
}

func (r SystemIntakeGRBReviewer) GetMappingKey() uuid.UUID {
	return r.SystemIntakeID
}
func (r SystemIntakeGRBReviewer) GetMappingVal() *SystemIntakeGRBReviewer {
	return &r
}

type SystemIntakeGRBReviewerComparisonResponse struct {
	authentication.UserAccount
	SystemIntakeGRBReviewer
	IsCurrentReviewer bool       `db:"is_current_reviewer"`
	RequestName       string     `db:"project_name"`
	EuaID             string     `db:"username"`
	CommonName        string     `db:"common_name"`
	IntakeCreatedAt   *time.Time `db:"intake_created_at"`
}
