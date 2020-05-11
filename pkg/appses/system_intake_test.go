package appses

import "github.com/google/uuid"

func (s *SESTestSuite) TestSendSystemIntakeEmail() {
	intakeID, _ := uuid.NewUUID()
	err := s.client.SendSystemIntakeSubmissionEmail("Test McTester", intakeID)
	s.NoError(err)
}
