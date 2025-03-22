package scheduler

import (
	"context"
	"time"

	"github.com/go-co-op/gocron/v2"
)

type grbEmailJobs struct {
	// SendAsyncVotingHalfwayThroughEmailJob is a job that sends an email when the voting session is halfway through
	SendAsyncVotingHalfwayThroughEmailJob ScheduleJobWrapper[AsyncGRBVotingInput]
}

// TODO: create a register call here as var instead of an init func? Something that is clear to others?
var GRBEmailJobs = GetGRBEmailJobs(GetScheduler())

// &grbEmailJobs{
// 	SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJobWrapper(sharedScheduler, gocron.CronJob("0 2 * * *", false), sendAsyncVotingHalfwayThroughEmailJobFunction),
// }

// GetGRBEmailJobs initializes all GRB email jobs
func GetGRBEmailJobs(scheduler gocron.Scheduler) *grbEmailJobs {
	return &grbEmailJobs{
		SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJobWrapper("SendAsyncVotingHalfwayThroughEmailJob", scheduler, gocron.CronJob("0 2 * * *", false), sendAsyncVotingHalfwayThroughEmailJobFunction, AsyncGRBVotingInput{endDate: time.Now()}),
	}
}

// TODO, does this even need input? It will be daily anyways.

// AsyncGRBVotingInput is the input for the GRB voting email job
type AsyncGRBVotingInput struct {
	endDate time.Time
}

func sendAsyncVotingHalfwayThroughEmailJobFunction(ctx context.Context, input AsyncGRBVotingInput) {
	_ = input.endDate
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
