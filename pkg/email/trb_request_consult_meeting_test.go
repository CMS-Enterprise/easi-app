package email

import (
	"context"
	"fmt"
	"path"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/google/uuid"
)

func (s *EmailTestSuite) TestTRBRequestConsultMeetingEmail() {
	sender := mockSender{}
	ctx := context.Background()

	meetingTime, err := time.Parse(time.RFC3339, "2022-01-01T13:30:00+00:00")
	s.NoError(err)

	trbId := uuid.New()
	trbLink := path.Join("trb", "task-list", trbId.String())

	input := SendTRBRequestConsultMeetingEmailInput{
		TRBRequestName:     "Test TRB Request",
		ConsultMeetingTime: meetingTime,
		CopyTRBMailbox:     true,
		NotifyEmails:       []models.EmailAddress{"McLovin@example.com", "Jane@example.com"},
		Notes:              "Some notes",
		RequesterName:      "Mc Lovin",
		TRBRequestID:       trbId,
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := `<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Technical Review Board (TRB) has scheduled a consult session for Test TRB Request on January 1, 2022 at 01:30 PM EST. You should receive a calendar invite shortly if you have not already.

<p>Additional notes about this consult session: Some notes</p>

<p>Next steps:</p>
<ul>
<li>Mc Lovin and the project team should make sure to upload any documentation to EASi that should be reviewed as a part of this request.</li>
<li>Attendees may also review guidance about preparing for the TRB consult session.</li>
<li>TRB members may continue to review the initial request form and supporting documents in EASi.</li>
<li>If a calendar invite has not already been sent, the TRB lead will send one with a remote video conferencing meeting link.</li>
</ul>

<p><a href="` + trbLink + `" style="font-weight: bold">View the request in EASi</a></p>

<p>If you have questions or need to request a reschedule, please email the TRB at ` + s.config.TRBEmail.String() + `.</p>

<p>Depending on the request, you may continue to receive email notifications about this request until it is closed.</p>
`
		fmt.Println(sender.body)
		err = client.SendTRBRequestConsultMeetingEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{"McLovin@example.com", "Jane@example.com", s.config.TRBEmail})
		s.Equal(expectedBody, sender.body)
	})
}
