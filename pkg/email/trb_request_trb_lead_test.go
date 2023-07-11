package email

import (
	"context"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
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

	input := SendTRBRequestTRBLeadEmailInput{
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

<p>Gary Jones is assigned to Test TRB Request as the TRB Lead.</p>

<p><a href="` + trbLink + `" style="font-weight: bold">View the request in EASi</a></p>

<p>Next steps:</p>
<ul>
<li>If it has not yet been reviewed, review the initial request form and determine if the request is ready for a consult session.</li>
<li>Work with Mc Lovin and the project team to decide on a day and time for the TRB consult session, and add the date in EASi.</li>
<li>Send a separate calendar invite with a remote video conferencing meeting link.</li>
</ul>
`
		err = client.sendTRBRequestTRBLeadAdminEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.Equal(expectedBody, sender.body)
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

	input := SendTRBRequestTRBLeadEmailInput{
		TRBRequestName: "Test TRB Request",
		RequesterName:  "Mc Lovin",
		TRBLeadName:    "Gary Jones",
		TRBRequestID:   trbID,
		Component:      "HR",
		TRBLeadEmail:   "gjones@fake.com",
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := `<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>You have been assigned as the TRB lead for ` + input.TRBRequestName + `, submitted by ` + input.RequesterName + ` for ` + input.Component + `. You may review the request and supporting documentation using the link below.</p>

<p><a href="` + trbLink + `" style="font-weight: bold">View the request in EASi</a></p>

<p>Next steps:</p>
<ul>
<li>If it has not yet been reviewed, review the initial request form and determine if the request is ready for a consult session.</li>
<li>Work with Mc Lovin and the project team to decide on a day and time for the TRB consult session, and add the date in EASi.</li>
<li>Send a separate calendar invite with a remote video conferencing meeting link.</li>
</ul>
`
		err = client.sendTRBRequestTRBLeadAssigneeEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{input.TRBLeadEmail})
		s.Equal(expectedBody, sender.body)
	})
}
