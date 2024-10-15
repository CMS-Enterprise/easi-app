package models

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

type SIGRBReviewerRole string

const (
	SIGRBRRCoChairCIO          SIGRBReviewerRole = "CO_CHAIR_CIO"
	SIGRBRRCoChairCFO          SIGRBReviewerRole = "CO_CHAIR_CFO"
	SIGRBRRCoChairHCA          SIGRBReviewerRole = "CO_CHAIR_HCA"
	SIGRBRRACA3021Rep          SIGRBReviewerRole = "ACA_3021_REP"
	SIGRBRRCCIIORep            SIGRBReviewerRole = "CCIIO_REP"
	SIGRBRRProgOpBDGChair      SIGRBReviewerRole = "PROGRAM_OPERATIONS_BDG_CHAIR"
	SIGRBRRCMCSRep             SIGRBReviewerRole = "CMCS_REP"
	SIGRBRRFedAdminBDGChair    SIGRBReviewerRole = "FED_ADMIN_BDG_CHAIR"
	SIGRBRRProgIntBDGChair     SIGRBReviewerRole = "PROGRAM_INTEGRITY_BDG_CHAIR"
	SIGRBRRQIORep              SIGRBReviewerRole = "QIO_REP"
	SIGRBRRSubjectMatterExpert SIGRBReviewerRole = "SUBJECT_MATTER_EXPERT"
	SIGRBRROther               SIGRBReviewerRole = "OTHER"
)

type SIGRBReviewerVotingRole string

const (
	SIGRBRVRVoting    SIGRBReviewerVotingRole = "VOTING"
	SIGRBRVRNonVoting SIGRBReviewerVotingRole = "NON_VOTING"
	SIGRBRVRAlternate SIGRBReviewerVotingRole = "ALTERNATE"
)

// SystemIntakeGRBReviewer describes
type SystemIntakeGRBReviewer struct {
	BaseStructUser
	userIDRelation
	SystemIntakeID uuid.UUID               `json:"systemIntakeId" db:"system_intake_id"`
	VotingRole     SIGRBReviewerVotingRole `json:"votingRole" db:"voting_role"`
	GRBRole        SIGRBReviewerRole       `json:"grbRole" db:"grb_role"`
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
