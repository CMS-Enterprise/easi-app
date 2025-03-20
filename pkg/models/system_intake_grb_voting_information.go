package models

import (
	"context"
	"errors"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
)

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

// NumberOfNoObjection returns the number of reviewers who have voted no objection
func (info *GRBVotingInformation) NumberOfNoObjection(ctx context.Context) (int, error) {
	if info.GRBReviewers == nil {
		msg := "unexpected empty GRB Reviewers list when counting NumberOfNoObjection"
		appcontext.ZLogger(ctx).Warn(msg)
		return 0, errors.New(msg)
	}

	var count int
	for _, reviewer := range info.GRBReviewers {
		if reviewer.Vote == nil {
			continue
		}

		if *reviewer.Vote == SystemIntakeAsyncGRBVotingOptionNoObjection {
			count++
		}
	}

	return count, nil
}

// NumberOfObjection returns the number of reviewers who have voted objection
func (info *GRBVotingInformation) NumberOfObjection(ctx context.Context) (int, error) {
	if info.GRBReviewers == nil {
		msg := "unexpected empty GRB Reviewers list when counting NumberOfObjection"
		appcontext.ZLogger(ctx).Warn(msg)
		return 0, errors.New(msg)
	}

	var count int
	for _, reviewer := range info.GRBReviewers {
		if reviewer.Vote == nil {
			continue
		}

		if *reviewer.Vote == SystemIntakeAsyncGRBVotingOptionObjection {
			count++
		}
	}

	return count, nil
}

// NumberOfNotVoted returns the number of reviewers who have not voted
func (info *GRBVotingInformation) NumberOfNotVoted(ctx context.Context) (int, error) {
	if info.GRBReviewers == nil {
		msg := "unexpected empty GRB Reviewers list when counting NumberOfNotVoted"
		appcontext.ZLogger(ctx).Warn(msg)
		return 0, errors.New(msg)
	}

	var count int
	for _, reviewer := range info.GRBReviewers {
		if reviewer.Vote == nil {
			count++
		}
	}

	return count, nil
}

// NumberOfVoted returns the number of reviewers who have voted
func (info *GRBVotingInformation) NumberOfVoted(ctx context.Context) (int, error) {
	if info.GRBReviewers == nil {
		msg := "unexpected empty GRB Reviewers list when counting NumberOfVoted"
		appcontext.ZLogger(ctx).Warn(msg)
		return 0, errors.New(msg)
	}

	var count int
	for _, reviewer := range info.GRBReviewers {
		if reviewer.Vote != nil {
			count++
		}
	}

	return count, nil
}

// QuorumReached checks if the minimum number of votes have been cast
func (info *GRBVotingInformation) QuorumReached(ctx context.Context) (bool, error) {
	voteCount, err := info.NumberOfVoted(ctx)
	if err != nil {
		return false, err
	}

	quorumReached := voteCount >= numberOfVotesForQuorum
	return quorumReached, nil
}

// VotingStatus returns the status of the GRB voting process. GQL will resolver to this field to return
//
// rules:
// - IN_PROGRESS:
//   - if voting is open/past due and is NOT in complete state
//
// - APPROVED:
//   - if voting is in complete state, quorum has been met, and zero objection votes
//
// - NOT_APPROVED:
//   - if voting is in complete state, quorum has been met, and two or more objection votes
//
// - INCONCLUSIVE:
//   - if voting is in complete state, end date has passed, quorum has been met, vote count is mostly no objections but
//     has one objection vote, OR;
//   - voting has been ended early and quorum not met
func (info *GRBVotingInformation) VotingStatus(ctx context.Context) (GRBVotingInformationStatus, error) {
	if info.SystemIntake == nil {
		msg := "unexpected nil system intake in VotingStatus"
		appcontext.ZLogger(ctx).Warn(msg)
		return "", errors.New(msg)
	}

	if info.GRBReviewers == nil {
		msg := "unexpected nil GRB reviewers in VotingStatus"
		appcontext.ZLogger(ctx).Warn(msg)
		return "", errors.New(msg)
	}

	//TODO implement
	return GRBVSNotStarted, nil
}
