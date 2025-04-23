package scheduler

import (
	"context"
	"errors"

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

	// SendAsyncPastDueNoQuorumEmailJob is a job that sends an email when a GRB review is past due but quorum is not met
	SendAsyncPastDueNoQuorumEmailJob ScheduledJob

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
			timing.DailyAt1001PM,
			sendAsyncPastDueNoQuorumEmailJobFunction,
		),

		SendAsyncReviewCompleteWithQuorumEmailJob: NewScheduledJob(
			"SendAsyncReviewCompleteWithQuorumEmailJob",
			scheduler,
			timing.DailyAt1001PM,
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

			reviewers, err := dataloaders.GetSystemIntakeGRBReviewersBySystemIntakeID(ctx, intake.ID)
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
				return errors.New("missing start and/or end date for sending halfway through email")
			}

			reviewers, err := dataloaders.GetSystemIntakeGRBReviewersBySystemIntakeID(ctx, intake.ID)
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
