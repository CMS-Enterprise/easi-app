package email

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestReportAProblemEmail() {
	sender := mockSender{}
	ctx := context.Background()

	input := SendReportAProblemEmailInput{
		IsAnonymous:            true,
		ReporterName:           "",
		ReporterEmail:          "",
		CanBeContacted:         false,
		EasiService:            "System Profile",
		WhatWereYouDoing:       "Trying to bookmark a system",
		WhatWentWrong:          "I was unable to bookmark the system",
		HowSevereWasTheProblem: "Quite severe",
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := `<p><strong>Reporter</strong></p>
<p>Anonymous</p>
<p>No, the EASi team may not contact me for additional information</p>


<p><strong>Which EASi service were you using?</strong></p>
<p>System Profile</p> 


<p><strong>What were you doing?</strong></p>
<p>Trying to bookmark a system</p> 


<p><strong>What went wrong?</strong></p>
<p>I was unable to bookmark the system</p> 


<p><strong>How severe was this problem?</strong></p>
<p>Quite severe</p>
`

		err = client.SendReportAProblemEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.EASIHelpEmail})
		s.Equal(expectedBody, sender.body)
	})
}
