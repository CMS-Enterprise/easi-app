package email

import (
	"context"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestTRBGuidanceLetterInternalReviewEmail() {
	sender := mockSender{}
	ctx := context.Background()

	trbID := uuid.New()
	trbRequestName := "Test TRB Request"

	getExpectedEmail := func(
		leadName string,
	) string {
		trbAdminGuidanceLetterLink := fmt.Sprintf(
			"%s://%s/%s",
			s.config.URLScheme,
			s.config.URLHost,
			path.Join("trb", trbID.String(), "guidance"),
		)
		var leadNameStr string
		if leadName != "" {
			leadNameStr = fmt.Sprintf(
				`<br>
				<p class="no-margin"><strong>TRB Lead:</strong> %s</p>`,
				leadName,
			)
		}
		return fmt.Sprintf(
			`<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s has a draft guidance letter that is now ready for internal review. Please take a moment to look over the draft and make any suggestions for improvement.</p>

			%s

			<br>
			<p><strong><a href="%s">View the guidance letter</a></strong></p>`,
			trbRequestName,
			leadNameStr,
			trbAdminGuidanceLetterLink,
		)
	}

	s.Run("successful call has the right content", func() {
		leadName := "Gary Jones"
		input := SendTRBGuidanceLetterInternalReviewEmailInput{
			TRBRequestName: trbRequestName,
			TRBLeadName:    leadName,
			TRBRequestID:   trbID,
		}
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := getExpectedEmail(
			input.TRBLeadName,
		)
		err = client.SendTRBGuidanceLetterInternalReviewEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.EqualHTML(expectedBody, sender.body)
	})

	s.Run("omits lead name if blank", func() {
		leadName := ""
		input := SendTRBGuidanceLetterInternalReviewEmailInput{
			TRBRequestName: trbRequestName,
			TRBLeadName:    leadName,
			TRBRequestID:   trbID,
		}
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := getExpectedEmail(
			input.TRBLeadName,
		)
		err = client.SendTRBGuidanceLetterInternalReviewEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.EqualHTML(expectedBody, sender.body)
	})
}
