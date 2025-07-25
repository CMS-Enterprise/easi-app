package resolvers

import (
	"time"
)

func (s *ResolverSuite) TestSendGRBReviewPresentationDeckReminderEmail() {
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	systemIntake, err := s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, systemIntake)
	s.NoError(err, "Failed to update system intake with requester email")

	emailSent, err := SendGRBReviewPresentationDeckReminderEmail(
		s.testConfigs.Context,
		systemIntake.ID,
		s.testConfigs.EmailClient,
		s.testConfigs.Store,
		s.fetchUserInfoStub,
	)
	s.NoError(err, "Failed to send email")

	updatedIntake, err := s.testConfigs.Store.FetchSystemIntakeByID(s.testConfigs.Context, systemIntake.ID)
	s.NoError(err, "Failed to fetch updated system intake after email send")

	s.True(emailSent, "Email should be sent successfully")
	s.NoError(err, "Function should not return an error")
	s.NotNil(updatedIntake.GrbPresentationDeckRequesterReminderEmailSentTime, "Email sent timestamp should be updated")

	// Compare timestamps correctly in UTC
	timeNow := time.Now().UTC()
	s.WithinDuration(timeNow, (*updatedIntake.GrbPresentationDeckRequesterReminderEmailSentTime).UTC(), time.Second, "Timestamps should match within 1 second")
}
