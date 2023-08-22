package sanitization

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSanitizeHTML(t *testing.T) {

	// TODO: add more test cases of expected filtered out results
	rawInput := "<p><strong>Notification email</strong></p><p>A <a href=\"asdasd\" target=\"_blank\">notification</a> email will be sent to the requester when you complete this action. If you would like, you may also send a copy to the TRB mailbox and/or to any additional attendees.</p><p>Choose recipients</p><ol><li><p>asd</p></li><li><p>asd</p></li><li><p>asdewg</p></li></ol><ul><li><p>Hello</p></li><li><p><em>;l;lk;kl;</em></p></li></ul><script>This is a script that will be sanitized</script>"
	expectedOutput := "<p><strong>Notification email</strong></p><p>A <a href=\"asdasd\" rel=\"nofollow\">notification</a> email will be sent to the requester when you complete this action. If you would like, you may also send a copy to the TRB mailbox and/or to any additional attendees.</p><p>Choose recipients</p><ol><li><p>asd</p></li><li><p>asd</p></li><li><p>asdewg</p></li></ol><ul><li><p>Hello</p></li><li><p><em>;l;lk;kl;</em></p></li></ul>"

	actualOutput := SanitizeHTML(rawInput)

	assert.EqualValues(t, expectedOutput, actualOutput)

}
