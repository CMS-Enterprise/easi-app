package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendSystemIntakeAdminUploadDocEmail() {
	ms := mockSender{}

	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	requestName := "Hotdog/Not Hotdog Program"
	requester := "Dr Fishopolis"
	requestComponent := "DOC"

	requestLink := fmt.Sprintf(
		"%s://%s/governance-review-team/%s/grb-review",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)

	recipient := models.NewEmailAddress("fake@fake.com")

	getExpectedEmail := func() string {
		return fmt.Sprintf(`
		<h1 class="header-title">EASi</h1>
		<p class="header-subtitle">Easy Access to System Information</p>

		<p>New documents have been added to GRB review for %[1]s. You can view the new documents using the link below.</p>

		<br>
		<p><strong><a href="%[2]s">View this request in EASi</a></strong></p>

		<br>
		<div class="no-margin">
		  <p><u>Request Summary</u></p>
		  <p><strong>Project title:</strong> %[1]s</p>
		  <p><strong>Requester:</strong> %[3]s, %[4]s
		  </p>
		</div>


		<br>
		<p>If you have questions, please contact the Governance Team at <a
		    href="mailto:%[5]s">%[5]s</a>.</p>
		<br>
		<hr>
		<p>You will continue to receive email notifications about your request until it is closed.</p>`,
			requestName,
			requestLink,
			requester,
			requestComponent,
			s.config.GRTEmail.String(),
		)
	}

	s.Run("successful admin doc upload email has the right content", func() {
		client, err := NewClient(s.config, &ms)
		s.NoError(err)
		err = client.SystemIntake.SendSystemIntakeAdminUploadDocEmail(ctx, SendSystemIntakeAdminUploadDocEmailInput{
			SystemIntakeID:     intakeID,
			RequestName:        requestName,
			RequesterName:      requester,
			RequesterComponent: requestComponent,
			Recipients:         []models.EmailAddress{recipient},
		})
		s.NoError(err)

		expectedSubject := fmt.Sprintf("New documents have been added to the GRB review for %s", requestName)
		s.Equal(expectedSubject, ms.subject)

		expectedEmail := getExpectedEmail()
		s.EqualHTML(expectedEmail, ms.body)

		// confirm ITGOV email is added before email send
		s.ElementsMatch([]models.EmailAddress{recipient, s.config.GRTEmail}, ms.bccAddresses)
	})
}
