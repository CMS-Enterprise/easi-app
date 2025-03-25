package scheduler

import (
	"context"

	"github.com/go-co-op/gocron/v2"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

type grbEmailJobs struct {
	// SendAsyncVotingHalfwayThroughEmailJob is a job that sends an email when the voting session is halfway through
	SendAsyncVotingHalfwayThroughEmailJob ScheduledJob
}

var GRBEmailJobs = GetGRBEmailJobs(GetScheduler())

// &grbEmailJobs{
// 	SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJobWrapper(sharedScheduler, gocron.CronJob("0 2 * * *", false), sendAsyncVotingHalfwayThroughEmailJobFunction),
// }

// GetGRBEmailJobs initializes all GRB email jobs
func GetGRBEmailJobs(scheduler gocron.Scheduler) *grbEmailJobs {
	return &grbEmailJobs{
		SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJob("SendAsyncVotingHalfwayThroughEmailJob", scheduler,
			//  gocron.CronJob("0 2 * * *", false),
			//this is for testing so that it runs every 5 seconds
			gocron.CronJob("*/5 * * * * *", true),
			sendAsyncVotingHalfwayThroughEmailJobFunction),
	}
}

func sendAsyncVotingHalfwayThroughEmailJobFunction(ctx context.Context, scheduledJob *ScheduledJob) {
	// contextWithLoader := dataloaders.CTXWithLoaders(ctx, BuildDataloaders(ctx))

	logger := scheduledJob.decoratedLogger(appcontext.ZLogger(ctx))
	store := Store(ctx)
	logger.Info("Running GRB voting halfway through email job")

	intakes, err := storage.GetSystemIntakesWithGRBReviewHalfwayThrough(ctx, store, logger)
	if err != nil {
		logger.Error("error fetching system intakes", zap.Error(err))
		return
	}
	for _, intake := range intakes {
		logger.Info("sending email to intake owner", zap.String("intakeID", intake.ID.String()))
	}

	/*
		TODO
		1. Get all the GRB voting sessions that are active and have not been completed
		2. For each of the voting sessions, check if the current day is halfway through the voting period
		3. If it is, send an email to the user who created the voting session
		   a. consider spinning up a separate job for each email

	*/
}

// func init() {
// 	RegisterJob("SendAsyncVotingHalfwayThroughEmailJob", func(store *storage.Store, scheduler gocron.Scheduler) {
// 		_, err := scheduler.NewJob(
// 			gocron.CronJob("0 2 * * *", false),
// 			gocron.NewTask(sendAsyncVotingHalfwayThroughEmailJobFunction,
// 				AsyncGRBVotingInput{endDate: time.Now()},
// 			),
// 		)
// 		if err != nil {
// 			fmt.Errorf("error scheduling job: %v", err)
// 		}
// 	})
// }
