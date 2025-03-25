package models

import (
	"context"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
)

func (s *ModelTestSuite) TestNumberOfNoObjection() {
	ctx := context.Background()
	ctx = appcontext.WithLogger(ctx, appcontext.ZLogger(ctx))

	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	_, err := info.NumberOfNoObjection(ctx)
	s.Error(err)

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

	count, err := info.NumberOfNoObjection(ctx)
	s.NoError(err)
	s.Equal(count, 1)
}

func (s *ModelTestSuite) TestNumberOfObjection() {
	ctx := context.Background()
	ctx = appcontext.WithLogger(ctx, appcontext.ZLogger(ctx))

	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	_, err := info.NumberOfObjection(ctx)
	s.Error(err)

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

	count, err := info.NumberOfObjection(ctx)
	s.NoError(err)
	s.Equal(count, 1)
}

func (s *ModelTestSuite) TestNumberOfNotVoted() {
	ctx := context.Background()
	ctx = appcontext.WithLogger(ctx, appcontext.ZLogger(ctx))

	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	_, err := info.NumberOfNotVoted(ctx)
	s.Error(err)

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

	count, err := info.NumberOfNotVoted(ctx)
	s.NoError(err)
	s.Equal(count, 0)

	// add a voter who did not vote
	info.GRBReviewers = append(info.GRBReviewers, &SystemIntakeGRBReviewer{
		GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
	})

	count, err = info.NumberOfNotVoted(ctx)
	s.NoError(err)
	s.Equal(count, 1)
}

func (s *ModelTestSuite) TestNumberOfVoted() {
	ctx := context.Background()
	ctx = appcontext.WithLogger(ctx, appcontext.ZLogger(ctx))

	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	_, err := info.NumberOfVoted(ctx)
	s.Error(err)

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

	count, err := info.NumberOfVoted(ctx)
	s.NoError(err)
	s.Equal(count, 2)
}

func (s *ModelTestSuite) TestQuorumReached() {
	ctx := context.Background()
	ctx = appcontext.WithLogger(ctx, appcontext.ZLogger(ctx))

	info := &GRBVotingInformation{}

	// confirm empty reviewers errors
	_, err := info.QuorumReached(ctx)
	s.Error(err)

	// add one non-voter just to make sure
	info.GRBReviewers = []*SystemIntakeGRBReviewer{
		{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleNonVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		},
	}

	// test the negative
	quorumMet, err := info.QuorumReached(ctx)
	s.NoError(err)
	s.False(quorumMet)

	// add enough votes for quorum to be met
	for i := 0; i < numberOfVotesForQuorum; i++ {
		info.GRBReviewers = append(info.GRBReviewers, &SystemIntakeGRBReviewer{
			GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
			Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
		})
	}

	// quorum should be met by now
	quorumMet, err = info.QuorumReached(ctx)
	s.NoError(err)
	s.True(quorumMet)
}

func (s *ModelTestSuite) TestVotingStatus() {
	ctx := context.Background()
	ctx = appcontext.WithLogger(ctx, appcontext.ZLogger(ctx))

	info := &GRBVotingInformation{}

	// confirm empty intake errors
	_, err := info.VotingStatus(ctx)
	s.Error(err)

	info.SystemIntake = &SystemIntake{}

	// confirm empty reviewers errors
	_, err = info.VotingStatus(ctx)
	s.Error(err)

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
	_, err = info.VotingStatus(ctx)
	s.Error(err)

	// put in future for later test
	info.SystemIntake.GRBReviewStartedAt = helpers.PointerTo(time.Now().AddDate(0, 0, 1))

	// confirm missing end date errors
	_, err = info.VotingStatus(ctx)
	s.Error(err)

	info.SystemIntake.GrbReviewAsyncEndDate = helpers.PointerTo(time.Now().AddDate(0, 0, 2))

	// confirm `not started` when start date is in the future
	result, err := info.VotingStatus(ctx)
	s.NoError(err)
	s.Equal(result, GRBVSNotStarted)

	// set startedAt date in the past to get `in progress`
	info.SystemIntake.GRBReviewStartedAt = helpers.PointerTo(time.Now().AddDate(0, 0, -1))

	result, err = info.VotingStatus(ctx)
	s.NoError(err)
	s.Equal(result, GRBVSInProgress)

	// set end date in the past, should get `in progress` because we don't have quorum at this point
	// move start date back two days
	info.SystemIntake.GRBReviewStartedAt = helpers.PointerTo(time.Now().AddDate(0, 0, -2))
	// move end date back one day
	info.SystemIntake.GrbReviewAsyncEndDate = helpers.PointerTo(time.Now().AddDate(0, 0, -1))

	result, err = info.VotingStatus(ctx)
	s.NoError(err)
	s.Equal(result, GRBVSInProgress)

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

	result, err = info.VotingStatus(ctx)
	s.NoError(err)
	s.Equal(result, GRBVSApproved)

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

	result, err = info.VotingStatus(ctx)
	s.NoError(err)
	s.Equal(result, GRBVSNotApproved)

	// remove one of the objections, should get `Inconclusive`
	info.GRBReviewers = info.GRBReviewers[:len(info.GRBReviewers)-1]

	result, err = info.VotingStatus(ctx)
	s.NoError(err)
	s.Equal(result, GRBVSInconclusive)

	// add a manual end date of yesterday
	info.SystemIntake.GrbReviewAsyncManualEndDate = helpers.PointerTo(time.Now().AddDate(0, 0, -1))

	result, err = info.VotingStatus(ctx)
	s.NoError(err)
	s.Equal(result, GRBVSInconclusive)
}
