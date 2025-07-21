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
	type testCase struct {
		name     string
		expected GRBVotingInformationStatus
		info     *GRBVotingInformation
	}

	now := time.Now()
	testCases := []testCase{
		{
			name:     "Empty intake",
			expected: GRBVSNotStarted,
			info:     &GRBVotingInformation{},
		},
		{
			name:     "Empty reviewers",
			expected: GRBVSNotStarted,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{},
			},
		},
		{
			name:     "Empty starting date",
			expected: GRBVSNotStarted,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{},
				GRBReviewers: []*SystemIntakeGRBReviewer{},
			},
		},
		{
			name:     "Empty end date",
			expected: GRBVSNotStarted,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{
					GRBReviewStartedAt: helpers.PointerTo(now.AddDate(0, 0, -1)),
				},
				GRBReviewers: []*SystemIntakeGRBReviewer{},
			},
		},
		{
			name:     "Inconclusive - ended manually with no quorum",
			expected: GRBVSInconclusive,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{
					GRBReviewStartedAt:          helpers.PointerTo(now.AddDate(0, 0, -2)),
					GrbReviewAsyncEndDate:       helpers.PointerTo(now.AddDate(0, 0, 1)),
					GrbReviewAsyncManualEndDate: helpers.PointerTo(now.AddDate(0, 0, -1)),
				},
				GRBReviewers: []*SystemIntakeGRBReviewer{},
			},
		},
		{
			name:     "Inconclusive - ended manually (one objection vote)",
			expected: GRBVSInconclusive,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{
					GRBReviewStartedAt:          helpers.PointerTo(now.AddDate(0, 0, -1)),
					GrbReviewAsyncEndDate:       helpers.PointerTo(now.AddDate(0, 0, 1)),
					GrbReviewAsyncManualEndDate: helpers.PointerTo(now.AddDate(0, 0, -1)),
				},
				GRBReviewers: []*SystemIntakeGRBReviewer{
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
				},
			},
		},
		{
			name:     "Inconclusive - ended naturally (one objection vote)",
			expected: GRBVSInconclusive,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{
					GRBReviewStartedAt:    helpers.PointerTo(now.AddDate(0, 0, -2)),
					GrbReviewAsyncEndDate: helpers.PointerTo(now.AddDate(0, 0, -1)),
				},
				GRBReviewers: []*SystemIntakeGRBReviewer{
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
				},
			},
		},
		{
			name:     "Approved - ended naturally (zero objection votes)",
			expected: GRBVSApproved,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{
					GRBReviewStartedAt:    helpers.PointerTo(now.AddDate(0, 0, -2)),
					GrbReviewAsyncEndDate: helpers.PointerTo(now.AddDate(0, 0, -1)),
				},
				GRBReviewers: []*SystemIntakeGRBReviewer{
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
				},
			},
		},
		{
			name:     "Approved - ended manually (zero objection votes)",
			expected: GRBVSApproved,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{
					GRBReviewStartedAt:          helpers.PointerTo(now.AddDate(0, 0, -1)),
					GrbReviewAsyncEndDate:       helpers.PointerTo(now.AddDate(0, 0, 1)),
					GrbReviewAsyncManualEndDate: helpers.PointerTo(now.AddDate(0, 0, -1)),
				},
				GRBReviewers: []*SystemIntakeGRBReviewer{
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
				},
			},
		},
		{
			name:     "Not Approved - ended manually (two or more objection votes)",
			expected: GRBVSNotApproved,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{
					GRBReviewStartedAt:          helpers.PointerTo(now.AddDate(0, 0, -1)),
					GrbReviewAsyncEndDate:       helpers.PointerTo(now.AddDate(0, 0, 1)),
					GrbReviewAsyncManualEndDate: helpers.PointerTo(now.AddDate(0, 0, -1)),
				},
				GRBReviewers: []*SystemIntakeGRBReviewer{
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
				},
			},
		},
		{
			name:     "Not Approved - ended naturally (two or more objection votes)",
			expected: GRBVSNotApproved,
			info: &GRBVotingInformation{
				SystemIntake: &SystemIntake{
					GRBReviewStartedAt:    helpers.PointerTo(now.AddDate(0, 0, -2)),
					GrbReviewAsyncEndDate: helpers.PointerTo(now.AddDate(0, 0, -1)),
				},
				GRBReviewers: []*SystemIntakeGRBReviewer{
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
					{
						GRBVotingRole: SystemIntakeGRBReviewerVotingRoleVoting,
						Vote:          helpers.PointerTo(SystemIntakeAsyncGRBVotingOptionNoObjection),
					},
				},
			},
		},
	}

	for _, tc := range testCases {
		s.Run(tc.name, func() {
			actual := tc.info.VotingStatus()
			s.Equal(tc.expected, actual)
		})
	}
}
