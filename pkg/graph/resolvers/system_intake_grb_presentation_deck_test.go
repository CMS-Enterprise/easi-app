package resolvers

import (
	"context"
	"time"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
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

// Test case: Missing Requester Email should return an error
func (s *ResolverSuite) TestSendGRBReviewPresentationDeckReminderEmail_MissingEmail() {
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	systemIntake.RequesterEmailAddress = null.NewString("", false)

	systemIntake, err := s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, systemIntake)
	s.NoError(err, "Failed to update system intake with missing requester email")

	emailSent, err := SendGRBReviewPresentationDeckReminderEmail(
		s.testConfigs.Context,
		systemIntake.ID,
		s.testConfigs.EmailClient,
		s.testConfigs.Store,
		func(context.Context, string) (*models.UserInfo, error) {
			return &models.UserInfo{
				Username:    "ANON",
				DisplayName: "Anonymous",
				Email:       models.NewEmailAddress(""),
			}, nil
		},
	)

	// Step 4: Assertions
	s.False(emailSent, "Email should NOT be sent due to missing requester email")
	s.Error(err, "Should return an error when requester email is missing")
	s.IsType(&apperrors.ResourceNotFoundError{}, err, "Error should be of type ResourceNotFoundError")
}
