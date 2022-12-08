package email

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestTRBRequestTRBLeadEmail() {
	sender := mockSender{}
	ctx := context.Background()

	input := SendTRBRequestTRBLeadEmailInput{
		TRBRequestName: "Test TRB Request",
		RequesterName:  "Mc Lovin",
		TRBLeadName:    "Gary Jones",
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := `Gary Jones is assigned to Test TRB Request as the TRB Lead.

<p><a href="">View the request in EASi</a></p>

<p>Next steps:</p>
<ul>
<li>If it has not yet been reviewed, review the initial request form and determine if the request is ready for a consult session.</li>
<li>Work with Mc Lovin and the project team to decide on a day and time for the TRB consult session, and add the date in EASi.</li>
<li>Send a separate calendar invite with a remote video conferencing meeting link.</li>
</ul>
`
		fmt.Println(sender.body)
		err = client.SendTRBRequestTRBLeadEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.Equal(expectedBody, sender.body)
	})
}
