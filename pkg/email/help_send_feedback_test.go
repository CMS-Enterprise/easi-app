package email

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendFeedbackEmail() {
	sender := mockSender{}
	ctx := context.Background()

	input := SendFeedbackEmailInput{
		IsAnonymous:            false,
		ReporterName:           "McLovin",
		ReporterEmail:          "mclovin@example.com",
		CanBeContacted:         true,
		EasiServicesUsed:       []string{"System Profile", "508 Testing", "System Profile"},
		CmsRole:                "Supreme Leader",
		SystemEasyToUse:        "Agree",
		DidntNeedHelpAnswering: "Disagree",
		QuestionsWereRelevant:  "I'm not sure: I have no idea what I'm doing",
		HadAccessToInformation: "Agree",
		HowSatisfied:           "Very Satisfied",
		HowCanWeImprove:        "Not enough virtual reality support",
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := `<p><strong>Reporter</strong></p>
<p>McLovin, mclovin@example.com</p>
<p>Yes, the EASi team may contact me for additional information</p>

<p><strong>Which EASi services have you used?</strong></p>
<ul>
<li>System Profile</li>

<li>508 Testing</li>

<li>System Profile</li>
</ul>

<p><strong>Role</strong></p>
<p>Supreme Leader</p>


<p><strong>The system was easy to use.</strong></p>
<p>Agree</p>


<p><strong>I didn’t need help answering any questions.</strong></p>
<p>Disagree</p>


<p><strong>All the questions on the form were relevant to my use case.</strong></p>
<p>I&#39;m not sure: I have no idea what I&#39;m doing</p>


<p><strong>I had access to all the information the form asked for.</strong></p>
<p>Agree</p>


<p><strong>Overall, how satisfied were you with the service?</strong></p>
<p>Very Satisfied</p>


<p><strong>How can we improve EASi?</strong></p>
<p>Not enough virtual reality support</p>
`

		err = client.SendFeedbackEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.EASIHelpEmail})
		s.Equal(expectedBody, sender.body)
	})
}
