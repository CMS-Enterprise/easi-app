package resolvers

import (
	"time"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
)

func (s *ResolverSuite) TestSendGRBReviewPresentationDeckReminderEmail() {
	// Step 1: Create a real system intake record in the database
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	// Step 2: Set the requester email and update the record in the DB
	requesterEmail := "requester@example.com"
	systemIntake.RequesterEmailAddress = null.StringFrom(requesterEmail)

	systemIntake, err := s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, systemIntake)
	s.NoError(err, "Failed to update system intake with requester email")

	// Step 3: Call the function to send the email
	emailSent, err := SendGRBReviewPresentationDeckReminderEmail(
		s.testConfigs.Context,
		systemIntake.ID,
		s.testConfigs.EmailClient,
		s.testConfigs.Store,
	)
	s.NoError(err, "Failed to send email")

	// Step 4: Fetch the updated record to verify timestamp update
	updatedIntake, err := s.testConfigs.Store.FetchSystemIntakeByID(s.testConfigs.Context, systemIntake.ID)
	s.NoError(err, "Failed to fetch updated system intake after email send")

	// Step 5: Assertions
	s.True(emailSent, "Email should be sent successfully")
	s.NoError(err, "Function should not return an error")
	s.NotNil(updatedIntake.GrbPresentationDeckRequesterReminderEmailSentTime, "Email sent timestamp should be updated")
	s.WithinDuration(time.Now(), *updatedIntake.GrbPresentationDeckRequesterReminderEmailSentTime, time.Second)
}

// Test case: Missing Requester Email should return an error
func (s *ResolverSuite) TestSendGRBReviewPresentationDeckReminderEmail_MissingEmail() {
	// Step 1: Create a real system intake record **without a requester email**
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	// Step 2: Ensure requester email is empty
	systemIntake.RequesterEmailAddress = null.NewString("", false)

	systemIntake, err := s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, systemIntake)
	s.NoError(err, "Failed to update system intake with missing requester email")

	// Step 3: Call the function
	emailSent, err := SendGRBReviewPresentationDeckReminderEmail(
		s.testConfigs.Context,
		systemIntake.ID,
		s.testConfigs.EmailClient,
		s.testConfigs.Store,
	)

	// Step 4: Assertions
	s.False(emailSent, "Email should NOT be sent due to missing requester email")
	s.Error(err, "Should return an error when requester email is missing")
	s.IsType(&apperrors.ResourceNotFoundError{}, err, "Error should be of type ResourceNotFoundError")
}
