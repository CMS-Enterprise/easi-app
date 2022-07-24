package email

import (
	"context"
	"fmt"
)

func (s *EmailTestSuite) TestSendCantFindSomethingEmail() {
	sender := mockSender{}
	ctx := context.Background()

	input := SendCantFindSomethingEmailInput{
		Name:  "McLovin",
		Email: "McLovin@example.com",
		Body:  "I can't find what I'm looking for",
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := `<p><strong>Reporter</strong></p>
<p>McLovin, McLovin@example.com</p> 
<br/>
<hr>
<br/>
<p><strong>What do you need help with?</strong></p>
<p>I can&#39;t find what I&#39;m looking for</p>
`
		fmt.Println(sender.body)

		err = client.SendCantFindSomethingEmail(ctx, input)
		s.NoError(err)
		s.Equal(s.config.EASIHelpEmail, sender.toAddress)
		s.Equal(expectedBody, sender.body)
	})
}
