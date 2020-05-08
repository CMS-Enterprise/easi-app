package ses

func (s *SESTestSuite) TestSendSystemIntakeEmail() {
	out, err := s.client.sendEmail()
	s.NoError(err)
	s.NotNil(out)
}
