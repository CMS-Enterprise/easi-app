package scheduler

import (
	"context"
	"errors"
	"fmt"
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
// this line initializes GRB email jobs
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
	logger, err := scheduledJob.logger(ctx)
	if err != nil {
		return err
	}

	logger = logger.With(logfields.EmailType("GRBReviewHalfwayThrough"))

	store, err := scheduledJob.store()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingStore, err)
		logger.Error(errGettingStore.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}
	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingEmailClient, err)
		logger.Error(errGettingEmailClient.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	buildDataLoaders, err := scheduledJob.buildDataLoaders()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errBuildingDataloaders, err)
		logger.Error(errBuildingDataloaders.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	ctx = dataloaders.CTXWithLoaders(ctx, buildDataLoaders)

	logger.Info(runningJob)

	intakes, err := storage.GetSystemIntakesWithGRBReviewHalfwayThrough(ctx, store, logger)
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errFetchingIntakes, err)
		logger.Error(errFetchingIntakes.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	for _, intake := range intakes {
		if _, err := OneTimeJob(ctx, SharedScheduler, intake, "SendAsyncVotingHalfwayThroughEmailJob", func(ctx context.Context, intake *models.SystemIntake) error {
			if intake.GRBReviewStartedAt == nil || intake.GrbReviewAsyncEndDate == nil {
				return errors.New("missing start and/or end date for sending halfway through email")
			}

			reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
			if err != nil {
				wrappedErr := fmt.Errorf("%[1]w: %[2]w", errProblemGettingReviewers, err)
				logger.Error(errProblemGettingReviewers.Error(), zap.Error(wrappedErr), logfields.IntakeID(intake.ID))
				return wrappedErr
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

			logger.Info(emailSent, logfields.IntakeID(intake.ID))
			return nil
		}); err != nil {
			logger.Error(errProblemSendingEmail.Error(), logfields.IntakeID(intake.ID), zap.Error(err))
			// we chose to continue here instead of returning an error, because we want to send emails to all intakes
			// even if one of them fails
			continue
		}

	}
	return nil
}

func sendAsyncPastDueNoQuorumEmailJobFunction(ctx context.Context, scheduledJob *ScheduledJob) error {
	logger, err := scheduledJob.logger(ctx)
	if err != nil {
		return err
	}

	logger = logger.With(logfields.EmailType("PastDueNoQuorum"))

	store, err := scheduledJob.store()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingStore, err)
		logger.Error(errGettingStore.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingEmailClient, err)
		logger.Error(errGettingEmailClient.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	buildDataLoaders, err := scheduledJob.buildDataLoaders()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errBuildingDataloaders, err)
		logger.Error(errBuildingDataloaders.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	ctx = dataloaders.CTXWithLoaders(ctx, buildDataLoaders)

	logger.Info(runningJob)

	intakes, err := storage.GetSystemIntakesWithGRBReviewPastDueNoQuorum(ctx, store, logger)
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errFetchingIntakes, err)
		logger.Error(errFetchingIntakes.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	for _, intake := range intakes {
		if _, err := OneTimeJob(ctx, SharedScheduler, intake, "SendAsyncPastDueNoQuorumEmailJob", func(ctx context.Context, intake *models.SystemIntake) error {
			if intake.GRBReviewStartedAt == nil || intake.GrbReviewAsyncEndDate == nil {
				return errors.New("missing start and/or end date for sending past due no quorum email")
			}

			reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
			if err != nil {
				wrappedErr := fmt.Errorf("%[1]w: %[2]w", errProblemGettingReviewers, err)
				logger.Error(errProblemGettingReviewers.Error(), zap.Error(wrappedErr), logfields.IntakeID(intake.ID))
				return wrappedErr
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

			logger.Info(emailSent, logfields.IntakeID(intake.ID))
			return nil
		}); err != nil {
			logger.Error(errProblemSendingEmail.Error(), logfields.IntakeID(intake.ID), zap.Error(err))
			// we chose to continue here instead of returning an error, because we want to send emails to all intakes
			// even if one of them fails
			continue
		}
	}

	return nil
}

func sendGRBReviewEndedEmailJobFunction(ctx context.Context, scheduledJob *ScheduledJob) error {
	logger, err := scheduledJob.logger(ctx)
	if err != nil {
		return err
	}

	logger = logger.With(logfields.EmailType("GRBReviewEnded"))

	store, err := scheduledJob.store()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingStore, err)
		logger.Error(errGettingStore.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingEmailClient, err)
		logger.Error(errGettingEmailClient.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	buildDataLoaders, err := scheduledJob.buildDataLoaders()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errBuildingDataloaders, err)
		logger.Error(errBuildingDataloaders.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	ctx = dataloaders.CTXWithLoaders(ctx, buildDataLoaders)

	logger.Info(runningJob)

	intakes, err := store.FetchSystemIntakes(ctx)
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errFetchingIntakes, err)
		logger.Error(errFetchingIntakes.Error(), zap.Error(wrappedErr))
		return wrappedErr
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

		// get GRB reviewers
		reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
		if err != nil {
			// don't exit with error, just log
			logger.Error(errProblemGettingReviewers.Error(), zap.Error(err), logfields.IntakeID(intake.ID))
			continue
		}

		// get user emails
		var emails []string
		for _, reviewer := range reviewers {
			userAccount, err := dataloaders.GetUserAccountByID(ctx, reviewer.UserID)
			if err != nil {
				// don't exit with error, just log
				logger.Error(errProblemGettingAccounts.Error(), zap.Error(err), logfields.IntakeID(intake.ID))
				continue
			}

			emails = append(emails, userAccount.Email)
		}

		for _, userEmail := range emails {
			if err := emailClient.SystemIntake.SendSystemIntakeGRBReviewEnded(
				ctx,
				email.SendSystemIntakeGRBReviewEndedInput{
					Recipient:          models.EmailAddress(userEmail),
					SystemIntakeID:     intake.ID,
					ProjectName:        intake.ProjectName.String,
					RequesterName:      intake.Requester,
					RequesterComponent: intake.Component.String,
					GRBReviewStart:     *intake.GRBReviewStartedAt,
					GRBReviewDeadline:  *intake.GrbReviewAsyncEndDate,
				},
			); err != nil {
				logger.Error(errProblemSendingEmail.Error(), logfields.IntakeID(intake.ID), zap.Error(err), zap.String("user.email", userEmail))
				continue
			}

			logger.Info(emailSent, logfields.IntakeID(intake.ID))
		}
	}

	return nil
}

func sendGRBReviewLastDayReminderJobFunction(
	ctx context.Context,
	scheduledJob *ScheduledJob,
) error {
	logger, err := scheduledJob.logger(ctx)
	if err != nil {
		return err
	}

	logger = logger.With(logfields.EmailType("GRBReviewLastDayReminder"))

	store, err := scheduledJob.store()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingStore, err)
		logger.Error(errGettingStore.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingEmailClient, err)
		logger.Error(errGettingEmailClient.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	buildDataLoaders, err := scheduledJob.buildDataLoaders()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errBuildingDataloaders, err)
		logger.Error(errBuildingDataloaders.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	ctx = dataloaders.CTXWithLoaders(ctx, buildDataLoaders)

	logger.Info(runningJob)

	// Fetch *all* intakes, we’ll filter in memory
	intakes, err := store.FetchSystemIntakes(ctx)
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errFetchingIntakes, err)
		logger.Error(errFetchingIntakes.Error(), zap.Error(wrappedErr))
		return wrappedErr
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
			logger.Error(errProblemGettingReviewers.Error(), zap.Error(err), logfields.IntakeID(intake.ID))
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
				logger.Error(errProblemGettingAccounts.Error(), zap.Error(err), logfields.IntakeID(intake.ID))
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
				logger.Error(errProblemSendingEmail.Error(), zap.Error(err), logfields.IntakeID(intake.ID), zap.String("user.email", userEmail))
				continue
			}
		}

		logger.Info(emailSent, logfields.IntakeID(intake.ID))
	}

	return nil
}

func sendAsyncReviewCompleteQuorumMetJobFunction(ctx context.Context, scheduledJob *ScheduledJob) error {
	logger, err := scheduledJob.logger(ctx)
	if err != nil {
		return err
	}

	logger = logger.With(logfields.EmailType("ReviewCompleteQuorumMet"))

	store, err := scheduledJob.store()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingStore, err)
		logger.Error(errGettingStore.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	emailClient, err := scheduledJob.emailClient()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errGettingEmailClient, err)
		logger.Error(errGettingEmailClient.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	buildDataLoaders, err := scheduledJob.buildDataLoaders()
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errBuildingDataloaders, err)
		logger.Error(errBuildingDataloaders.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	ctx = dataloaders.CTXWithLoaders(ctx, buildDataLoaders)

	logger.Info(runningJob)

	intakes, err := storage.GetSystemaIntakesWithGRBReviewCompleteQuorumMet(ctx, store, logger)
	if err != nil {
		wrappedErr := fmt.Errorf("%[1]w: %[2]w", errFetchingIntakes, err)
		logger.Error(errFetchingIntakes.Error(), zap.Error(wrappedErr))
		return wrappedErr
	}

	for _, intake := range intakes {
		if _, err := OneTimeJob(ctx, SharedScheduler, intake, "SendAsyncReviewCompleteWithQuorumEmailJob", func(ctx context.Context, intake *models.SystemIntake) error {
			if intake.GRBReviewStartedAt == nil || intake.GrbReviewAsyncEndDate == nil {
				return errors.New("missing start and/or end date for sending review complete quorum met email")
			}

			reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
			if err != nil {
				wrappedErr := fmt.Errorf("%[1]w: %[2]w", errProblemGettingReviewers, err)
				logger.Error(errProblemGettingReviewers.Error(), zap.Error(wrappedErr), logfields.IntakeID(intake.ID))
				return wrappedErr
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
