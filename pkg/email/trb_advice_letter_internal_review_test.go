package email

import (
	"context"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestTRBAdviceLetterInternalReviewEmail() {
	sender := mockSender{}
	ctx := context.Background()

	trbID := uuid.New()

	trbAdminAdviceLetterLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", trbID.String(), "advice"),
	)

	input := SendTRBAdviceLetterInternalReviewEmailInput{
		TRBRequestName: "Test TRB Request",
		RequesterName:  "Mc Lovin",
		TRBLeadName:    "Gary Jones",
		TRBRequestID:   trbID,
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := `<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>` + input.TRBRequestName + ` has a draft advice letter that is now ready for internal review. Please take a moment to look over the draft and make any suggestions for improvement.</p>

<p>TRB Lead: ` + input.TRBLeadName + `</p>

<p><a href="` + trbAdminAdviceLetterLink + `" style="font-weight: bold">View the Advice Letter</a></p>
`
		err = client.SendTRBAdviceLetterInternalReviewEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.Equal(expectedBody, sender.body)

		input.TRBLeadName = ""
		expectedBody = `<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>` + input.TRBRequestName + ` has a draft advice letter that is now ready for internal review. Please take a moment to look over the draft and make any suggestions for improvement.</p>

<p><a href="` + trbAdminAdviceLetterLink + `" style="font-weight: bold">View the Advice Letter</a></p>
`
		err = client.SendTRBAdviceLetterInternalReviewEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.Equal(expectedBody, sender.body)
	})
}
