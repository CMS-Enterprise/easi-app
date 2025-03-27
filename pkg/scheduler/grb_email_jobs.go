package scheduler

import (
	"context"

	"github.com/go-co-op/gocron/v2"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/logfields"
	"github.com/cms-enterprise/easi-app/pkg/scheduler/timing"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

type grbEmailJobs struct {
	// SendAsyncVotingHalfwayThroughEmailJob is a job that sends an email when the voting session is halfway through
	SendAsyncVotingHalfwayThroughEmailJob ScheduledJob
}

var GRBEmailJobs = GetGRBEmailJobs(GetScheduler())

// GetGRBEmailJobs initializes all GRB email jobs
func GetGRBEmailJobs(scheduler gocron.Scheduler) *grbEmailJobs {
	return &grbEmailJobs{
		SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJob("SendAsyncVotingHalfwayThroughEmailJob", scheduler,
			timing.Every5Seconds,
			// timing.DailyAt2AM,
			sendAsyncVotingHalfwayThroughEmailJobFunction),
	}
}

func sendAsyncVotingHalfwayThroughEmailJobFunction(ctx context.Context, scheduledJob *ScheduledJob) {
	// contextWithLoader := dataloaders.CTXWithLoaders(ctx, BuildDataloaders(ctx))

	logger := scheduledJob.decoratedLogger(appcontext.ZLogger(ctx))
	store := Store(ctx)
	logger.Info("Running GRB voting halfway through email job")
	emailClient := EmailClient(ctx)

	intakes, err := storage.GetSystemIntakesWithGRBReviewHalfwayThrough(ctx, store, logger)
	if err != nil {
		logger.Error("error fetching system intakes", zap.Error(err))
		return
	}
	for _, intake := range intakes {
		//TODO
		/*1. For each of the intakes, send an email to the relevant people on the intake
		a. consider spinning up a separate job for each email
		*/

		_, err := OneTimeJob(ctx, SharedScheduler2, emailClient, "SendAsyncVotingHalfwayThroughEmailJob", func(ctx context.Context, emailClient *email.Client) {

			//TODO: this should be fully implemented so that it sends an email. You could also return the emailClient from context, this is merely an example
			logger.Info("sending email to intake owner", logfields.IntakeID(intake.ID))
		})
		if err != nil {
			logger.Error("error scheduling email job", logfields.IntakeID(intake.ID), zap.Error(err))
			return
		}

	}
}
