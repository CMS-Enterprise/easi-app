package scheduler

import (
	"context"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/scheduler/timing"
)

type oktaJobs struct {
	// SendAsyncVotingHalfwayThroughEmailJob is a job that sends a request after fifteen days, to prevent the token from expiring
	ReauthenticateWithOktaJob ScheduledJob
}

// OktaJobs is the exported representation of all Okta scheduled jobs
var OktaJobs = getOktaJobs(SharedScheduler)

// getOktaJobs initializes all Okta jobs
func getOktaJobs(scheduler *Scheduler) *oktaJobs {
	return &oktaJobs{
		ReauthenticateWithOktaJob: NewScheduledJob(
			"ReauthenticateWithOktaJob",
			scheduler,
			timing.FifteenDays,
			reauthenticateWithOktaJobFunction,
		),
	}
}

func reauthenticateWithOktaJobFunction(ctx context.Context, scheduledJob *ScheduledJob) error {
	logger, err := scheduledJob.logger()
	if err != nil {
		return err
	}

	userSearchClient, err := scheduledJob.userSearchClient()
	if err != nil {
		logger.Error("error getting userSearchClient from scheduler", zap.Error(err))
		return err
	}
	logger.Info("Running Okta Bimonthly Re-authentication job")

	_, err = userSearchClient.FetchUserInfo(ctx, "calling to re-auth")
	if err != nil {
		logger.Error("error fetching user info from Okta in the 15 day window", zap.Error(err))
		return err
	}
	logger.Info("Okta token refreshed after 15 days")

	return nil
}
