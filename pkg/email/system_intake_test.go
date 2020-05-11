package email

import "github.com/google/uuid"

func (s *SESTestSuite) TestSendSystemIntakeEmail() {
	intakeID, _ := uuid.Parse("1abc2671-c5df-45a0-b2be-c30899b473bf")
	err := s.client.SendSystemIntakeSubmissionEmail("Test McTester", intakeID)
	s.NoError(err)
}
