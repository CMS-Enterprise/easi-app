package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendSystemIntakeGRBReviewerReminder() {
	const dateFormat = "01/02/2006"

	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")
	projectTitle := "Reminder Test Project"
	requesterName := "Reminder Requester"
	requesterComponent := "Reminder Component"
	startDate := time.Now().AddDate(0, 0, -2)
	endDate := time.Now().AddDate(0, 0, 2)
	formattedStart := startDate.Format(dateFormat)
	formattedEnd := endDate.Format(dateFormat)
	itGovInboxAddress := s.config.GRTEmail.String()

	requestLink := fmt.Sprintf(
		"%s://%s/it-governance/%s/grb-review",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)

	recipient := models.NewEmailAddress("fake@fake.com")

	expectedEmail := fmt.Sprintf(`
	<h1 class="header-title">EASi</h1>
	<p class="header-subtitle">Easy Access to System Information</p>

	<p>Reminder: Your input and feedback as a GRB member is due soon for %[1]s. Please vote by %[2]s at 5pm Eastern Time. Use the link below to review the request materials and vote on the merit of the project.</p>

	<p><strong><a href="%[3]s">View this request in EASi</a></strong></p>


	<div class="no-margin">
		<p><strong>Request summary:</strong></p>
		<p>Project title: %[1]s</p>
		<p>Requester: %[4]s, %[5]s</p>
		<p>GRB review dates: %[6]s</p>
	</div>

	<p>If you have questions, please contact the Governance Team at <a href="mailto:%[7]s">%[7]s</a>.</p>
	<hr>

	<p>You may continue to receive email notifications about this request until a decision is issued and it is closed.</p>`,
		projectTitle,
		formattedEnd,
		requestLink,
		requesterName,
		requesterComponent,
		fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		itGovInboxAddress,
	)

	s.Run("successful voting reminder email has the right content", func() {
		ms := mockSender{}
		client, err := NewClient(s.config, &ms)
		s.NoError(err)

		err = client.SystemIntake.SendSystemIntakeGRBReviewerReminder(
			ctx,
			SendSystemIntakeGRBReviewerReminderInput{
				Recipient:          recipient,
				SystemIntakeID:     intakeID,
				RequestName:        projectTitle,
				RequesterName:      requesterName,
				RequesterComponent: requesterComponent,
				StartDate:          startDate,
				EndDate:            endDate,
			},
		)
		s.NoError(err)

		expectedSubject := fmt.Sprintf("GRB reminder: review and share your input (%s)", projectTitle)
		s.Equal(expectedSubject, ms.subject)

		s.EqualHTML(expectedEmail, ms.body)
	})
}
