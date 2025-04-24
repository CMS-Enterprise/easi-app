package scheduler

import (
	"context"
	"errors"
	"time"

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
	// SendGRBReviewEndedEmailJob is a job that sends an email when the GRB review has ended
	SendGRBReviewEndedEmailJob ScheduledJob
}

// GRBEmailJobs is the exported representation of all GRB email scheduled jobs
var GRBEmailJobs = getGRBEmailJobs(SharedScheduler)

// getGRBEmailJobs initializes all GRB email jobs
func getGRBEmailJobs(scheduler *Scheduler) *grbEmailJobs {
	return &grbEmailJobs{
		SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJob("SendAsyncVotingHalfwayThroughEmailJob", scheduler,
			timing.DailyAt2AM,
			sendAsyncVotingHalfwayThroughEmailJobFunction),

		SendGRBReviewEndedEmailJob: NewScheduledJob("SendGRBReviewEndedEmailJob", scheduler,
			timing.DailyAt10_01PMUTC,
			sendGRBReviewEndedEmailJobFunction),
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

			logger.Info("sending email to intake owner", logfields.IntakeID(intake.ID))
			return nil
		}); err != nil {
			logger.Error("error scheduling email job", logfields.IntakeID(intake.ID), zap.Error(err))
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
