package models

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
)

func (s *ModelTestSuite) TestNumberOfNoObjection() {
	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	count := info.NumberOfNoObjection()
	s.Zero(count)

	// add one objection and one no-objection, then add one non-voting role vote to make sure we don't count it
	info.GRBReviewers = []*SystemIntakeGRBReviewer{
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleNonVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
	}

	count = info.NumberOfNoObjection()
	s.Equal(count, 1)
}

func (s *ModelTestSuite) TestNumberOfObjection() {
	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	count := info.NumberOfObjection()
	s.Zero(count)

	// add one objection and one no-objection, then add one non-voting role vote to make sure we don't count it
	info.GRBReviewers = []*SystemIntakeGRBReviewer{
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleNonVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
	}

	count = info.NumberOfObjection()
	s.Equal(count, 1)
}

func (s *ModelTestSuite) TestNumberOfNotVoted() {
	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	count := info.NumberOfNotVoted()
	s.Zero(count)

	// add one objection and one no-objection, then add one non-voting role vote to make sure we don't count it
	info.GRBReviewers = []*SystemIntakeGRBReviewer{
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleNonVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
	}

	count = info.NumberOfNotVoted()

	s.Equal(count, 0)

	// add a voter who did not vote
	info.GRBReviewers = append(info.GRBReviewers, &SystemIntakeGRBReviewer{
		GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
	})

	count = info.NumberOfNotVoted()
	s.Equal(count, 1)
}

func (s *ModelTestSuite) TestNumberOfVoted() {
	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	count := info.NumberOfVoted()
	s.Zero(count)

	// add one objection and one no-objection, then add one non-voting role vote to make sure we don't count it
	info.GRBReviewers = []*SystemIntakeGRBReviewer{
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleNonVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
	}

	count = info.NumberOfVoted()
	s.Equal(count, 2)
}

func (s *ModelTestSuite) TestQuorumReached() {
	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	quorumReached := info.QuorumReached()
	s.False(quorumReached)

	// add one non-voter just to make sure
	info.GRBReviewers = []*SystemIntakeGRBReviewer{
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleNonVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
	}

	// test the negative
	quorumReached = info.QuorumReached()
	s.False(quorumReached)

	// add enough votes for quorum to be met
	for i := 0; i < numberOfVotesForQuorum; i++ {
		info.GRBReviewers = append(info.GRBReviewers, &SystemIntakeGRBReviewer{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		})
	}

	// quorum should be met by now
	quorumReached = info.QuorumReached()
	s.True(quorumReached)
}

func (s *ModelTestSuite) TestVotingStatus() {
	info := &GRBVotingInformation{}

	// confirm empty intake errors
	votingStatus := info.VotingStatus()
	s.Equal(votingStatus, GRBVSNotStarted)

	info.SystemIntake = &SystemIntake{}

	// confirm empty reviewers errors
	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSNotStarted)

	// add one objection and one no-objection, then add one non-voting role vote to make sure we don't count it
	info.GRBReviewers = []*SystemIntakeGRBReviewer{
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleNonVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
	}

	// confirm missing startedAt date errors
	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSNotStarted)

	// put in future for later test
	info.SystemIntake.GRBReviewStartedAt = helpers.PointerTo(time.Now().AddDate(0, 0, 1))

	// confirm missing end date errors
	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSNotStarted)

	info.SystemIntake.GrbReviewAsyncEndDate = helpers.PointerTo(time.Now().AddDate(0, 0, 2))

	// confirm `not started` when start date is in the future
	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSNotStarted)

	// set startedAt date in the past to get `in progress`
	info.SystemIntake.GRBReviewStartedAt = helpers.PointerTo(time.Now().AddDate(0, 0, -1))

	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSInProgress)

	// set end date in the past, should get `in progress` because we don't have quorum at this point
	// move start date back two days
	info.SystemIntake.GRBReviewStartedAt = helpers.PointerTo(time.Now().AddDate(0, 0, -2))
	// move end date back one day
	info.SystemIntake.GrbReviewAsyncEndDate = helpers.PointerTo(time.Now().AddDate(0, 0, -1))

	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSInProgress)

	// add more no-objection votes (zero objection votes at this point)
	// should get `Approved`
	info.GRBReviewers = append(info.GRBReviewers,
		&SystemIntakeGRBReviewer{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
		&SystemIntakeGRBReviewer{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
		&SystemIntakeGRBReviewer{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
		&SystemIntakeGRBReviewer{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		})

	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSApproved)

	// add two objections, should get `Not Approved`
	info.GRBReviewers = append(info.GRBReviewers,
		&SystemIntakeGRBReviewer{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
		},
		&SystemIntakeGRBReviewer{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
		},
	)

	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSNotApproved)

	// remove one of the objections, should get `Inconclusive`
	info.GRBReviewers = info.GRBReviewers[:len(info.GRBReviewers)-1]

	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSInconclusive)

	// add a manual end date of yesterday
	info.SystemIntake.GrbReviewAsyncManualEndDate = helpers.PointerTo(time.Now().AddDate(0, 0, -1))

	votingStatus = info.VotingStatus()
	s.Equal(votingStatus, GRBVSInconclusive)
}
