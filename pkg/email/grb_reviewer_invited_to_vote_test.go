package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendGRBReviewerInvitedToVoteEmail() {
	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")

	startDate := time.Now().AddDate(0, 0, -1)
	endDate := time.Now().AddDate(0, 0, -1)

	formattedStart := startDate.Format("01/02/2006")
	formattedEnd := endDate.Format("01/02/2006")

	projectName := "Invite to Vote Project"
	requesterName := "Invite Requester Name"
	requesterComponent := "Office of Healthcare Experience and Interoperability"

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

<p>The Governance Admin Team has requested that the Governance Review Board (GRB) review an IT Governance request and give their input on the merit of the project.</p>

<br>
<p>Use the link below to:</p>
<div class="no-margin">
  <uL>
    <li>Review project materials and documentation.</li>
    <li>Ask questions or have discussions with other GRB members, the project team, and the Governance Admin Team.</li>
    <li>Cast your vote if you are a voting member of the GRB.</li>
  </uL>
</div>

<p>You will have until %[1]s at 5pm Eastern Time to submit your vote.</p>

<p><strong><a href="%[2]s">View this request in EASi</a></strong></p>

<div class="no-margin">
  <p><strong>Request summary:</strong></p>
  <p>Project title: %[3]s</p>
  <p>Requester: %[4]s, %[5]s</p>
  <p>GRB review dates: %[6]s</p>
</div>

<p>If you have questions, please contact the Governance Admin Team at <a href="mailto:%[7]s">%[7]s</a>.</p>
<hr>
<p>You may continue to receive email notifications about this request until a decision is issued and it is closed.</p>`,
		formattedEnd,
		requestLink,
		projectName,
		requesterName,
		translation.GetComponentAcronym(requesterComponent),
		fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		s.config.GRTEmail.String(),
	)

	s.Run("successful voting invite email has the right content", func() {
		ms := mockSender{}
		client, err := NewClient(s.config, &ms)
		s.NoError(err)

		err = client.SystemIntake.SendGRBReviewerInvitedToVoteEmail(ctx, SendGRBReviewerInvitedToVoteInput{
			Recipient:          recipient,
			StartDate:          startDate,
			EndDate:            endDate,
			SystemIntakeID:     intakeID,
			ProjectName:        projectName,
			RequesterName:      requesterName,
			RequesterComponent: requesterComponent,
		})
		s.NoError(err)

		expectedSubject := fmt.Sprintf("GRB review requested: Your input is needed for an IT Governance request (%s)", projectName)
		s.Equal(expectedSubject, ms.subject)

		s.EqualHTML(expectedEmail, ms.body)
	})
}
