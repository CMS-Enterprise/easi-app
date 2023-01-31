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
	trbLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", "task-list", trbID.String()),
	)

	// TODO - figure out what this URL will be once it's in the frontend
	trbAdviceLetterLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", "advice-letter", trbID.String()),
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

<p><a href="` + trbAdviceLetterLink + `" style="font-weight: bold">View the Advice Letter</a></p>

<p><a href="` + trbLink + `" style="font-weight: bold">View the request in EASi</a></p>
`
		err = client.SendTRBAdviceLetterInternalReviewEmail(ctx, input)
		fmt.Println(sender.body)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.Equal(expectedBody, sender.body)
	})
}
