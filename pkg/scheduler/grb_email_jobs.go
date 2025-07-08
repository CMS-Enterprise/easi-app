package scheduler

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/logfields"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/scheduler/timing"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

type grbEmailJobs struct {
	// SendAsyncVotingHalfwayThroughEmailJob is a job that sends an email when the voting session is halfway through
	SendAsyncVotingHalfwayThroughEmailJob ScheduledJob

	// SendAsyncPastDueNoQuorumEmailJob is a job that sends and email when a GRB review is past due but quorum is not met
	SendAsyncPastDueNoQuorumEmailJob ScheduledJob // TODO: Consider using OneTimeJob type

	// SendGRBReviewEndedEmailJob is a job that sends an email when the GRB review has ended
	SendGRBReviewEndedEmailJob ScheduledJob // TODO: Consider using OneTimeJob type

	// SendGRBReviewLastDayReminderJob is a job that sends an email when the GRB review is on the last day
	SendGRBReviewLastDayReminderJob ScheduledJob // TODO: Consider using OneTimeJob type

	// SendAsyncReviewCompleteWithQuorumEmailJob is a job that sends when a GRB review is finished and quorum has been met
	SendAsyncReviewCompleteWithQuorumEmailJob ScheduledJob
}

// GRBEmailJobs is the exported representation of all GRB email scheduled jobs
var GRBEmailJobs = getGRBEmailJobs(SharedScheduler)

// getGRBEmailJobs initializes all GRB email jobs
func getGRBEmailJobs(scheduler *Scheduler) *grbEmailJobs {
	return &grbEmailJobs{
		SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJob(
			"SendAsyncVotingHalfwayThroughEmailJob",
			scheduler,
			timing.DailyAt2AM,
			sendAsyncVotingHalfwayThroughEmailJobFunction,
		),

		SendAsyncPastDueNoQuorumEmailJob: NewScheduledJob(
			"SendAsyncPastDueNoQuorumEmailJob",
			scheduler,
			timing.DailyAt10_01PMUTC,
			sendAsyncPastDueNoQuorumEmailJobFunction,
		),

		SendGRBReviewEndedEmailJob: NewScheduledJob(
			"SendGRBReviewEndedEmailJob",
			scheduler,
			timing.DailyAt10_01PMUTC,
			sendGRBReviewEndedEmailJobFunction,
		),

		SendGRBReviewLastDayReminderJob: NewScheduledJob(
			"SendGRBReviewLastDayReminderJob",
			scheduler,
			timing.DailyAt1PMUTC,
			sendGRBReviewLastDayReminderJobFunction,
		),

		SendAsyncReviewCompleteWithQuorumEmailJob: NewScheduledJob(
			"SendAsyncReviewCompleteWithQuorumEmailJob",
			scheduler,
			timing.DailyAt10_01PMUTC,
			sendAsyncReviewCompleteQuorumMetJobFunction,
		),
	}
}

func sendAsyncVotingHalfwayThroughEmailJobFunction(ctx context.Context, scheduledJob *ScheduledJob) error {
	logger, err := scheduledJob.logger()
	if err != nil {
		return err
	}

	store, err := scheduledJob.store()
	if err != nil {
		logger.Error("error getting store from scheduler", zap.Error(err))
		return err
	}
	logger.Info("Running GRB voting halfway through email job")
	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		logger.Error("error getting email client from scheduler", zap.Error(err))
		return err
	}

	intakes, err := storage.GetSystemIntakesWithGRBReviewHalfwayThrough(ctx, store, logger)
	if err != nil {
		logger.Error("error fetching system intakes", zap.Error(err))
		return err
	}

	for _, intake := range intakes {
		if _, err := OneTimeJob(ctx, SharedScheduler, intake, "SendAsyncVotingHalfwayThroughEmailJob", func(ctx context.Context, intake *models.SystemIntake) error {
			if intake.GRBReviewStartedAt == nil || intake.GrbReviewAsyncEndDate == nil {
				return errors.New("missing start and/or end date for sending halfway through email")
			}

			reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
			if err != nil {
				return err
			}

			votingInformation := models.GRBVotingInformation{
				SystemIntake: intake,
				GRBReviewers: reviewers,
			}

			if err := emailClient.SystemIntake.SendGRBReviewHalfwayThrough(ctx, email.SendGRBReviewHalfwayThroughInput{
				SystemIntakeID:     intake.ID,
				ProjectTitle:       intake.ProjectName.String,
				RequesterName:      intake.Requester,
				RequesterComponent: intake.Component.String,
				StartDate:          *intake.GRBReviewStartedAt,
				EndDate:            *intake.GrbReviewAsyncEndDate,
				NoObjectionVotes:   votingInformation.NumberOfNoObjection(),
				ObjectionVotes:     votingInformation.NumberOfObjection(),
				NotYetVoted:        votingInformation.NumberOfNotVoted(),
			}); err != nil {
				return err
			}

			logger.Info("sending voting halfway through email", logfields.IntakeID(intake.ID))
			return nil
		}); err != nil {
			logger.Error("error scheduling voting halfway through email job", logfields.IntakeID(intake.ID), zap.Error(err))
			// we chose to continue here instead of returning an error, because we want to send emails to all intakes
			// even if one of them fails
			continue
		}

	}
	return nil
}

func sendAsyncPastDueNoQuorumEmailJobFunction(ctx context.Context, scheduledJob *ScheduledJob) error {
	logger, err := scheduledJob.logger()
	if err != nil {
		return err
	}

	store, err := scheduledJob.store()
	if err != nil {
		logger.Error("error getting store from scheduler", zap.Error(err))
		return err
	}

	logger.Info("Running GRB review past due no quorum email job")

	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		logger.Error("error getting email client from scheduler", zap.Error(err))
		return err
	}

	intakes, err := storage.GetSystemIntakesWithGRBReviewPastDueNoQuorum(ctx, store, logger)
	if err != nil {
		logger.Error("error getting past due no quorum intakes", zap.Error(err))
		return err
	}

	for _, intake := range intakes {
		if _, err := OneTimeJob(ctx, SharedScheduler, intake, "SendAsyncPastDueNoQuorumEmailJob", func(ctx context.Context, intake *models.SystemIntake) error {
			if intake.GRBReviewStartedAt == nil || intake.GrbReviewAsyncEndDate == nil {
				return errors.New("missing start and/or end date for sending past due no quorum email")
			}

			reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
			if err != nil {
				return err
			}

			votingInformation := models.GRBVotingInformation{
				SystemIntake: intake,
				GRBReviewers: reviewers,
			}

			if err := emailClient.SystemIntake.SendGRBReviewPastDueNoQuorum(ctx, email.SendGRBReviewPastDueNoQuorumInput{
				SystemIntakeID:     intake.ID,
				ProjectTitle:       intake.ProjectName.String,
				RequesterName:      intake.Requester,
				RequesterComponent: intake.Component.String,
				StartDate:          *intake.GRBReviewStartedAt,
				EndDate:            *intake.GrbReviewAsyncEndDate,
				NoObjectionVotes:   votingInformation.NumberOfNoObjection(),
				ObjectionVotes:     votingInformation.NumberOfObjection(),
				NotYetVoted:        votingInformation.NumberOfNotVoted(),
			}); err != nil {
				return err
			}

			logger.Info("sending past due no quorum email", logfields.IntakeID(intake.ID))
			return nil
		}); err != nil {
			logger.Error("error scheduling past due no quorum email job", logfields.IntakeID(intake.ID), zap.Error(err))
			// we chose to continue here instead of returning an error, because we want to send emails to all intakes
			// even if one of them fails
			continue
		}
	}

	return nil
}

func sendGRBReviewEndedEmailJobFunction(ctx context.Context, scheduledJob *ScheduledJob) error {
	logger, err := scheduledJob.logger()
	if err != nil {
		return err
	}

	store, err := scheduledJob.store()
	if err != nil {
		logger.Error("error getting store from scheduler", zap.Error(err))
		return err
	}

	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		logger.Error("error getting email client from scheduler", zap.Error(err))
		return err
	}

	logger.Info("Running GRB review ended email job")

	intakes, err := store.FetchSystemIntakes(ctx)
	if err != nil {
		logger.Error("error fetching system intakes", zap.Error(err))
		return err
	}

	now := time.Now().UTC().Truncate(24 * time.Hour)

	for _, intake := range intakes {
		if intake.GrbReviewType != models.SystemIntakeGRBReviewTypeAsync {
			continue
		}
		if intake.GRBReviewStartedAt == nil || intake.GrbReviewAsyncEndDate == nil {
			continue
		}
		// Don't resend if voting has been manually ended
		if intake.GrbReviewAsyncManualEndDate != nil {
			continue
		}
		// Only send if the review end was reached
		if intake.GrbReviewAsyncEndDate.After(now) {
			continue
		}

		if intake.RequesterEmailAddress.Valid && intake.ProjectName.Valid {
			if err := emailClient.SystemIntake.SendSystemIntakeGRBReviewEnded(
				ctx,
				email.SendSystemIntakeGRBReviewEndedInput{
					Recipient:          models.NewEmailAddress(intake.RequesterEmailAddress.String),
					SystemIntakeID:     intake.ID,
					ProjectName:        intake.ProjectName.String,
					RequesterName:      intake.Requester,
					RequesterComponent: intake.Component.String,
					GRBReviewStart:     *intake.GRBReviewStartedAt,
					GRBReviewDeadline:  *intake.GrbReviewAsyncEndDate,
				},
			); err != nil {
				logger.Error("failed to send GRB Review Ended email", logfields.IntakeID(intake.ID), zap.Error(err))
				continue
			}

			logger.Info("sent GRB Review Ended email", logfields.IntakeID(intake.ID))
		}
	}

	return nil
}

func sendGRBReviewLastDayReminderJobFunction(
	ctx context.Context,
	scheduledJob *ScheduledJob,
) error {
	// ---- helpers ----
	logger, err := scheduledJob.logger()
	if err != nil {
		return err
	}
	store, err := scheduledJob.store()
	if err != nil {
		logger.Error("error getting store from scheduler", zap.Error(err))
		return err
	}
	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		logger.Error("error getting email client from scheduler", zap.Error(err))
		return err
	}

	logger.Info("Running GRB review LAST-DAY reminder job")

	// Fetch *all* intakes, we’ll filter in memory
	intakes, err := store.FetchSystemIntakes(ctx)
	if err != nil {
		logger.Error("error fetching system intakes", zap.Error(err))
		return err
	}

	// Today truncated to 00:00 UTC
	todayUTC := time.Now().UTC().Truncate(24 * time.Hour)

	for _, intake := range intakes {
		if intake.GRBReviewStartedAt == nil {
			continue // incomplete data
		}

		var deadline time.Time

		// Select the deadline based on the review type
		if intake.GrbReviewType == models.SystemIntakeGRBReviewTypeAsync {
			if intake.GrbReviewAsyncManualEndDate != nil {
				continue
			} else if intake.GrbReviewAsyncEndDate == nil {
				continue
			} else {
				deadline = *intake.GrbReviewAsyncEndDate
			}
		} else {
			if intake.GRBDate == nil {
				continue
			} else {
				deadline = *intake.GRBDate
			}
		}

		if deadline.IsZero() {
			continue
		}

		// Is the async end-date **today**?
		endDateUTC := deadline.UTC().Truncate(24 * time.Hour)
		if !endDateUTC.Equal(todayUTC) {
			continue // not the last-day yet (or already passed)
		}

		grbReviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
		if err != nil {
			logger.Error("problem getting GRB reviewers when sending Last Day email", zap.Error(err), zap.String("intake.id", intake.ID.String()))
			continue
		}

		// we only want to send this email to voting roles who have not voted
		var recipients []*models.SystemIntakeGRBReviewer
		for _, grbReviewer := range grbReviewers {
			// if reviewer is not a voter, skip
			if grbReviewer.GRBVotingRole != models.SystemIntakeGRBReviewerVotingRoleVoting {
				continue
			}

			// if reviewer has already voted, skip
			if grbReviewer.Vote != nil {
				continue
			}

			recipients = append(recipients, grbReviewer)
		}

		// get user emails
		var emails []string
		for _, reviewer := range recipients {
			userAccount, err := dataloaders.GetUserAccountByID(ctx, reviewer.UserID)
			if err != nil {
				logger.Error("problem getting accounts when sending Last Day email", zap.Error(err), zap.String("intake.id", intake.ID.String()))
				continue
			}

			emails = append(emails, userAccount.Email)
		}

		for _, userEmail := range emails {
			if err := emailClient.SystemIntake.SendSystemIntakeGRBReviewLastDay(
				ctx,
				email.SendSystemIntakeGRBReviewLastDayInput{
					Recipient:          models.EmailAddress(userEmail),
					SystemIntakeID:     intake.ID,
					ProjectName:        intake.ProjectName.String,
					RequesterName:      intake.Requester,
					RequesterComponent: intake.Component.String,
					GRBReviewStart:     *intake.GRBReviewStartedAt,
					GRBReviewDeadline:  deadline,
				},
			); err != nil {
				logger.Error("problem sending Last Day email", zap.Error(err), zap.String("intake.id", intake.ID.String()), zap.String("user.email", userEmail))
				continue
			}
		}

		logger.Info("sent GRB last-day reminder", logfields.IntakeID(intake.ID))
	}

	return nil
}

func sendAsyncReviewCompleteQuorumMetJobFunction(ctx context.Context, scheduledJob *ScheduledJob) error {
	logger, err := scheduledJob.logger()
	if err != nil {
		return err
	}

	store, err := scheduledJob.store()
	if err != nil {
		logger.Error("error getting store from scheduler", zap.Error(err))
		return err
	}

	logger.Info("Running GRB review complete with quorum met email job")

	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		logger.Error("error getting email client from scheduler", zap.Error(err))
		return err
	}

	intakes, err := storage.GetSystemaIntakesWithGRBReviewCompleteQuorumMet(ctx, store, logger)
	if err != nil {
		logger.Error("error getting review complete quorum met intakes", zap.Error(err))
		return err
	}

	for _, intake := range intakes {
		if _, err := OneTimeJob(ctx, SharedScheduler, intake, "SendAsyncReviewCompleteWithQuorumEmailJob", func(ctx context.Context, intake *models.SystemIntake) error {
			if intake.GRBReviewStartedAt == nil || intake.GrbReviewAsyncEndDate == nil {
				return errors.New("missing start and/or end date for sending review complete quorum met email")
			}

			reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
			if err != nil {
				return err
			}

			votingInformation := models.GRBVotingInformation{
				SystemIntake: intake,
				GRBReviewers: reviewers,
			}

			if err := emailClient.SystemIntake.SendGRBReviewCompleteQuorumMet(ctx, email.SendGRBReviewCompleteQuorumMetInput{
				SystemIntakeID:     intake.ID,
				ProjectTitle:       intake.ProjectName.String,
				RequesterName:      intake.Requester,
				RequesterComponent: intake.Component.String,
				StartDate:          *intake.GRBReviewStartedAt,
				EndDate:            *intake.GrbReviewAsyncEndDate,
				NoObjectionVotes:   votingInformation.NumberOfNoObjection(),
				ObjectionVotes:     votingInformation.NumberOfObjection(),
				NotYetVoted:        votingInformation.NumberOfNotVoted(),
			}); err != nil {
				return err
			}

			logger.Info("sending review complete quorum met email", logfields.IntakeID(intake.ID))
			return nil
		}); err != nil {
			logger.Error("error scheduling review complete quorum met email job", logfields.IntakeID(intake.ID), zap.Error(err))
			// we chose to continue here instead of returning an error, because we want to send emails to all intakes
			// even if one of them fails
			continue
		}

	}
	return nil
}
