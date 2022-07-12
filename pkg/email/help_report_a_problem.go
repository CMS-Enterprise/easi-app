package email

// SendReportAProblemEmailInput contains the data submitted by the user to the "report a problem" help form
type SendReportAProblemEmailInput struct {
	IsAnonymous            bool
	CanBeContacted         bool
	EasiService            string
	WhatWereYouDoing       string
	WhatWentWrong          string
	HowSevereWasTheProblem string
}
