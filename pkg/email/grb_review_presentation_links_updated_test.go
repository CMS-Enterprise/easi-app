package email

import (
	"context"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendGRBReviewPresentationLinksUpdatedEmail() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	requestName := "Presentation Links"
	requester := "Nobody"
	requesterComponent := "ABCD"
	recipients := []models.EmailAddress{"someone@cms.gov"}

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewPresentationLinksUpdatedEmail(
		ctx,
		SendGRBReviewPresentationLinksUpdatedEmailInput{
			SystemIntakeID:     intakeID,
			ProjectName:        requestName,
			RequesterName:      requester,
			RequesterComponent: requesterComponent,
			Recipients:         recipients,
		},
	)
	s.NoError(err)

	expectedSubject := fmt.Sprintf("Presentation links updated on the GRB review for %s", requestName)
	s.Equal(expectedSubject, sender.subject)

	s.ElementsMatch(sender.toAddresses, recipients)
	s.ElementsMatch(sender.ccAddresses, []models.EmailAddress{s.config.GRTEmail})

	intakePath := path.Join("it-governance", intakeID.String(), "grb-review")

	grbReviewLink := client.urlFromPath(intakePath)

	expectedEmail := fmt.Sprintf(`
		<h1 class="header-title">EASi</h1>
		<p class="header-subtitle">Easy Access to System Information</p>

		<p>The Governance Admin Team has updated the presentation recording links on the GRB review for %[1]s. You
  		may view the recording and/or slide deck using the link below.</p>

		<p><strong><a href="%[2]s">View this request in EASi</a></strong></p>

		<br>
		<div class="no-margin">
  		  <p><strong>Request summary:</strong></p>
  		  <p><strong>Project title:</strong> %[1]s</p>
  		  <p><strong>Requester:</strong> %[3]s, %[4]s</p>
		</div>

		<br>
		<p>If you have questions, please contact the Governance Team at <a
		    href="mailto:%[5]s">%[5]s</a>.</p>
		<hr>
		<p>You will continue to receive email notifications about this request until it is closed.</p>`,
		requestName,
		grbReviewLink,
		requester,
		requesterComponent,
		s.config.GRTEmail.String(),
	)

	s.EqualHTML(expectedEmail, sender.body)
}
