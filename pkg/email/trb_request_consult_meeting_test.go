package email

import (
	"context"
	"fmt"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestTRBRequestConsultMeetingEmail() {
	sender := mockSender{}
	ctx := context.Background()

	meetingTime, err := time.Parse(time.RFC3339, "2022-01-01T18:33:00+00:00") // UTC time, will convert to 13:33, or 01:33 PM EST
	s.NoError(err)

	trbID := uuid.New()
	trbLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", "task-list", trbID.String()),
	)
	trbHelpLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("help", "trb", "prepare-consult-meeting"),
	)

	getExpectedEmail := func(
		requestName string,
		requesterName string,
		meetingTime time.Time,
		notes *string,
	) string {
		trbInbox := s.config.TRBEmail.String()
		tz, err := time.LoadLocation("America/New_York")
		if err != nil {
			panic(err)
		}
		meetingTimeFormatted := meetingTime.In(tz).Format("January 2, 2006 at 03:04 PM MST")
		var notesStr string
		if notes != nil {
			notesStr = fmt.Sprintf(
				`<br>
				<p class="no-margin-top">Additional notes about this consult session: %s</p>`,
				*notes,
			)
		}
		return fmt.Sprintf(
			`<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The Technical Review Board (TRB) has scheduled a consult session for %s on %s. You should receive a calendar invite shortly if you have not already.</p>

			%s

			<br>
			<div class="no-margin">
			  <p>Next steps:</p>
			  <ul>
				<li>%s and the project team should make sure to upload any documentation to EASi that should be reviewed as a part of this request.</li>
				<li>Attendees may also review guidance about <a href="%s">preparing for the TRB consult session</a>.</li>
				<li>TRB members may continue to review the initial request form and supporting documents in EASi.</li>
				<li>If a calendar invite has not already been sent, the TRB lead will send one with a remote video conferencing meeting link.</li>
			  </ul>
			</div>

			<br>
			<p><strong><a href="%s">View the request in EASi</a></strong></p>

			<br>
			<p>If you have questions or need to request a reschedule, please email the TRB at <a href="mailto:%s">%s</a>.</p>

			<br>
			<hr>

			<p>Depending on the request, you may continue to receive email notifications about this request until it is closed.</p>`,
			requestName,
			meetingTimeFormatted,
			notesStr,
			requesterName,
			trbHelpLink,
			trbLink,
			trbInbox,
			trbInbox,
		)
	}

	s.Run("successful call has the right content", func() {
		input := SendTRBRequestConsultMeetingEmailInput{
			TRBRequestName:     "Test TRB Request",
			ConsultMeetingTime: meetingTime,
			CopyTRBMailbox:     true,
			NotifyEmails:       []models.EmailAddress{"McLovin@example.com", "Jane@example.com"},
			Notes:              "Some notes",
			RequesterName:      "Mc Lovin",
			TRBRequestID:       trbID,
		}
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := getExpectedEmail(
			input.TRBRequestName,
			input.RequesterName,
			input.ConsultMeetingTime,
			&input.Notes,
		)
		err = client.SendTRBRequestConsultMeetingEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{"McLovin@example.com", "Jane@example.com", s.config.TRBEmail})
		s.EqualHTML(expectedBody, sender.body)
	})

	s.Run("omits notes if blank", func() {
		input := SendTRBRequestConsultMeetingEmailInput{
			TRBRequestName:     "Test TRB Request",
			ConsultMeetingTime: meetingTime,
			CopyTRBMailbox:     true,
			NotifyEmails:       []models.EmailAddress{"McLovin@example.com", "Jane@example.com"},
			Notes:              "",
			RequesterName:      "Mc Lovin",
			TRBRequestID:       trbID,
		}
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := getExpectedEmail(
			input.TRBRequestName,
			input.RequesterName,
			input.ConsultMeetingTime,
			nil,
		)
		err = client.SendTRBRequestConsultMeetingEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{"McLovin@example.com", "Jane@example.com", s.config.TRBEmail})
		s.EqualHTML(expectedBody, sender.body)
	})
}
