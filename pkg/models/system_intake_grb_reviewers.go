package models

import (
	"github.com/google/uuid"
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
	BaseStruct
	EUAUserID      string                  `json:"euaUserId" db:"eua_user_id"`
	SystemIntakeID uuid.UUID               `json:"systemIntakeId" db:"system_intake_id"`
	VotingRole     SIGRBReviewerVotingRole `json:"votingRole" db:"voting_role"`
	GRBRole        SIGRBReviewerRole       `json:"grbRole" db:"grb_role"`
}

func NewSystemIntakeGRBReviewer(createdBy string) *SystemIntakeGRBReviewer {
	return &SystemIntakeGRBReviewer{
		BaseStruct: NewBaseStruct(createdBy),
	}
}
