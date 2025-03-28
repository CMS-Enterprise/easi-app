package models

import (
	"time"
)

// TODO: move to autogen

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
func (info *GRBVotingInformation) NumberOfNoObjection() int {
	if info.GRBReviewers == nil {
		return 0
	}

	var count int
	for _, reviewer := range info.GRBReviewers {
		if reviewer.GRBVotingRole != SystemIntakeGRBReviewerVotingRoleVoting {
			continue
		}

		if reviewer.Vote == nil {
			continue
		}

		if *reviewer.Vote == SystemIntakeAsyncGRBVotingOptionNoObjection {
			count++
		}
	}

	return count
}

// NumberOfObjection returns the number of reviewers who have voted objection
func (info *GRBVotingInformation) NumberOfObjection() int {
	if info.GRBReviewers == nil {
		return 0
	}

	var count int
	for _, reviewer := range info.GRBReviewers {
		if reviewer.GRBVotingRole != SystemIntakeGRBReviewerVotingRoleVoting {
			continue
		}

		if reviewer.Vote == nil {
			continue
		}

		if *reviewer.Vote == SystemIntakeAsyncGRBVotingOptionObjection {
			count++
		}
	}

	return count
}

// NumberOfNotVoted returns the number of reviewers who have not voted
func (info *GRBVotingInformation) NumberOfNotVoted() int {
	if info.GRBReviewers == nil {
		return 0
	}

	var count int
	for _, reviewer := range info.GRBReviewers {
		if reviewer.GRBVotingRole != SystemIntakeGRBReviewerVotingRoleVoting {
			continue
		}

		if reviewer.Vote == nil {
			count++
		}
	}

	return count
}

// NumberOfVoted returns the number of reviewers who have voted
func (info *GRBVotingInformation) NumberOfVoted() int {
	if info.GRBReviewers == nil {
		return 0
	}

	var count int
	for _, reviewer := range info.GRBReviewers {
		// only count reviewers who have voting roles
		if reviewer.GRBVotingRole != SystemIntakeGRBReviewerVotingRoleVoting {
			continue
		}

		if reviewer.Vote != nil {
			count++
		}
	}

	return count
}

// QuorumReached checks if the minimum number of votes have been cast
func (info *GRBVotingInformation) QuorumReached() bool {
	return info.NumberOfVoted() >= numberOfVotesForQuorum
}

// VotingStatus returns the status of the GRB voting process. GQL will resolver to this field to return
//
// rules:
// - IN_PROGRESS:
//   - if voting is open/past due (quorum not met) and is NOT in complete state
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
func (info *GRBVotingInformation) VotingStatus() GRBVotingInformationStatus {
	if info.SystemIntake == nil {
		return GRBVSNotStarted
	}

	if info.GRBReviewers == nil {
		return GRBVSNotStarted
	}

	if info.SystemIntake.GRBReviewStartedAt == nil {
		return GRBVSNotStarted
	}

	// TODO: it may be possible to submit votes even after the end date - address if needed
	if info.SystemIntake.GrbReviewAsyncEndDate == nil {
		return GRBVSNotStarted
	}

	now := time.Now()
	quorumReached := info.QuorumReached()

	// if manually ended and quorum not reached, inconclusive result
	if info.SystemIntake.GrbReviewAsyncManualEndDate != nil && now.After(*info.SystemIntake.GrbReviewAsyncManualEndDate) && !quorumReached {
		return GRBVSInconclusive
	}

	// check if currently in progress
	if now.After(*info.SystemIntake.GRBReviewStartedAt) && now.Before(*info.SystemIntake.GrbReviewAsyncEndDate) {
		return GRBVSInProgress
	}

	// past due, but still in progress
	if now.After(*info.SystemIntake.GrbReviewAsyncEndDate) && !quorumReached {
		return GRBVSInProgress
	}

	// we know here that the end date has passed

	objections := info.NumberOfObjection()

	// check for approved
	if quorumReached && objections == 0 {
		return GRBVSApproved
	}

	// check for not approved
	if quorumReached && objections > 1 {
		return GRBVSNotApproved
	}

	// check for inconclusive
	if quorumReached && objections == 1 {
		return GRBVSInconclusive
	}

	return GRBVSNotStarted
}
