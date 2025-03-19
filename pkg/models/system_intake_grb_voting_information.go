package models

import "context"

type GRBVotingInformationStatus string

// These are the options for GRBVotingInformationStatus
const (
	GRBVSNotStarted   GRBVotingInformationStatus = "NOT_STARTED"
	GRBVSInProgress   GRBVotingInformationStatus = "IN_PROGRESS"
	GRBVSApproved     GRBVotingInformationStatus = "APPROVED"
	GRBVSNotApproved  GRBVotingInformationStatus = "NOT_APPROVED"
	GRBVSInconclusive GRBVotingInformationStatus = "INCONCLUSIVE"
)

// numberOfVotesForQuorum is the number of votes needed to reach quorum. If less than this amount of votes are cast, the GRB is considered inconclusive
const numberOfVotesForQuorum = 5

// GRBVotingInformation is a struct that holds information about the GRB voting process
// It is a convenience struct that holds a SystemIntake and its GRB reviewers
// we form it this way so that we can easily calculate information about the voting process
type GRBVotingInformation struct {
	SystemIntake *SystemIntake
	GRBReviewers []*SystemIntakeGRBReviewer
}

// VotingStatus returns the status of the GRB voting process. GQL will resolver to this field to return
func (info *GRBVotingInformation) VotingStatus(ctx context.Context) (GRBVotingInformationStatus, error) {
	//TODO implement
	return GRBVSNotStarted, nil
}

// NumberOfNoObjection returns the number of reviewers who have voted no objection
func (info *GRBVotingInformation) NumberOfNoObjection(ctx context.Context) (int, error) {
	//TODO implement
	return 0, nil
}

// NumberOfObjection returns the number of reviewers who have voted objection
func (info *GRBVotingInformation) NumberOfObjection(ctx context.Context) (int, error) {
	//TODO implement
	return 0, nil
}

// NumberOfNotVoted returns the number of reviewers who have not voted
func (info *GRBVotingInformation) NumberOfNotVoted(ctx context.Context) (int, error) {
	//TODO implement
	return 0, nil
}

// NumberOfVoted returns the number of reviewers who have voted
func (info *GRBVotingInformation) NumberOfVoted(ctx context.Context) (int, error) {
	//TODO implement
	return 0, nil
}

// QuorumReached checks if the minimum amount of reviewers have voted
func (info *GRBVotingInformation) QuorumReached(ctx context.Context) (bool, error) {
	//TODO implement
	voteCount, err := info.NumberOfVoted(ctx)
	if err != nil {
		return false, err
	}
	quorum := voteCount >= numberOfVotesForQuorum
	return quorum, nil
}
