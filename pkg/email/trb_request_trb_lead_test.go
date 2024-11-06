package email

import (
	"context"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestTRBRequestTRBLeadAdminEmail() {
	sender := mockSender{}
	ctx := context.Background()

	trbID := uuid.New()
	trbLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", trbID.String(), "request"),
	)

	getExpectedEmail := func(
		requestName string,
		requesterName string,
		trbLeadName string,
	) string {
		return fmt.Sprintf(
			`<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s is assigned to %s as the TRB Lead.</p>

			<br>
			<p class="no-margin-top"><strong><a href="%s">View the request in EASi</a></strong></p>

			<br>
			<div class="no-margin">
			  <p>Next steps:</p>
			  <ul>
				<li>If it has not yet been reviewed, review the initial request form and determine if the request is ready for a consult session.</li>
				<li>Work with %s and the project team to decide on a day and time for the TRB consult session, and add the date in EASi.</li>
				<li>Send a separate calendar invite with a remote video conferencing meeting link.</li>
			  </ul>
			</div>
			`,
			trbLeadName,
			requestName,
			trbLink,
			requesterName,
		)
	}

	s.Run("successful call has the right content", func() {
		input := SendTRBRequestTRBLeadEmailInput{
			TRBRequestName: "Test TRB Request",
			RequesterName:  "Mc Lovin",
			TRBLeadName:    "Gary Jones",
			TRBRequestID:   trbID,
		}
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := getExpectedEmail(
			input.TRBRequestName,
			input.RequesterName,
			input.TRBLeadName,
		)
		err = client.sendTRBRequestTRBLeadAdminEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.EqualHTML(expectedBody, sender.body)
	})
}

func (s *EmailTestSuite) TestTRBRequestTRBLeadAssigneeEmail() {
	sender := mockSender{}
	ctx := context.Background()

	trbID := uuid.New()
	trbLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", trbID.String(), "request"),
	)

	getExpectedEmail := func(
		requestName string,
		requesterName string,
		trbLeadName string,
		component string,
	) string {
		var componentStr string
		if component != "" {
			componentStr = "for " + component
		}
		return fmt.Sprintf(
			`<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>You have been assigned as the TRB lead for %s, submitted by %s %s. You may review the request and supporting documentation using the link below.</p>

			<br>
			<p class="no-margin-top"><strong><a href="%s">View the request in EASi</a></strong></p>

			<br>
			<div class="no-margin">
			  <p>Next steps:</p>
			  <ul>
				<li>If it has not yet been reviewed, review the initial request form and determine if the request is ready for a consult session.</li>
				<li>Work with %s and the project team to decide on a day and time for the TRB consult session, and add the date in EASi.</li>
				<li>Send a separate calendar invite with a remote video conferencing meeting link.</li>
			  </ul>
			</div>`,
			requestName,
			requesterName,
			componentStr,
			trbLink,
			requesterName,
		)
	}

	s.Run("successful call has the right content", func() {
		input := SendTRBRequestTRBLeadEmailInput{
			TRBRequestName: "Test TRB Request",
			RequesterName:  "Mc Lovin",
			TRBLeadName:    "Gary Jones",
			TRBRequestID:   trbID,
			Component:      "HR",
			TRBLeadEmail:   "gjones@fake.com",
		}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := getExpectedEmail(
			input.TRBRequestName,
			input.RequesterName,
			input.TRBLeadName,
			input.Component,
		)
		err = client.sendTRBRequestTRBLeadAssigneeEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{input.TRBLeadEmail})
		s.EqualHTML(expectedBody, sender.body)
	})
}
