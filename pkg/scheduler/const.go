package scheduler

import "errors"

var (
	errGettingStore            = errors.New("error getting store from scheduler")
	errGettingEmailClient      = errors.New("error getting email client from scheduler")
	errBuildingDataloaders     = errors.New("error building dataloaders")
	errFetchingIntakes         = errors.New("error fetching intakes")
	errProblemSendingEmail     = errors.New("problem sending email")
	errProblemGettingAccounts  = errors.New("problem getting accounts")
	errProblemGettingReviewers = errors.New("problem getting reviewers")
)

const (
	runningJob = "running job"
	emailSent  = "email sent"
)
