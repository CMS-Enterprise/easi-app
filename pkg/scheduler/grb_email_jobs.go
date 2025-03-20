package scheduler

import (
	"context"
	"time"

	"github.com/go-co-op/gocron/v2"
)

type grbEmailJobs struct {
	SendAsyncVotingHalfwayThroughEmailJob ScheduleJobWrapper[AsyncGRBVotingInput]
}

var GRBEmailJobs = &grbEmailJobs{
	SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJobWrapper(sharedScheduler, gocron.CronJob("0 2 * * *", false), sendAsyncVotingHalfwayThroughEmailJobFunction),
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
