package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExtractHTMLSpansRegex(t *testing.T) {
	htmlMention := `<p>Hey <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="4744bb54-c7d3-485a-9985-fdab4b86d28d" data-label="Alexander Stark">@Alexander Stark</span>!  Will you be able to join the meeting next week?  If not, can you contact <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="ab2b16ef-1928-4788-ad9c-263300ace094" data-label="Terry Thompson">@Terry Thompson</span> to let them know?</p>`
	mentionNodes, err := tagsFromStringRegex(htmlMention)
	assert.NotNil(t, mentionNodes)
	assert.NoError(t, err)

	assert.Len(t, mentionNodes, 2)

}

// TestExtractHTMLSpansRegexWithoutMentions ensures that we don't attempt to parse span elements
// that don't have a data-type="mention" attribute
func TestExtractHTMLSpansRegexWithoutMentions(t *testing.T) {
	// Check case with NO mentions
	html := `<p>Hey @Alexander Stark!  Will you be able to join the meeting next week?  If not, can you contact @Terry Thompson to let them know?</p>`
	mentionNodes, err := tagsFromStringRegex(html)
	// Make sure we don't get an error, and that we get no results back
	assert.NoError(t, err)
	assert.Len(t, mentionNodes, 0)

	// Check case with 2 spans, but only one is a mention
	html = `<p>Hey <span class="mention" tag-type="USER_ACCOUNT" data-id-db="4744bb54-c7d3-485a-9985-fdab4b86d28d">@Alexander Stark</span>!  Will you be able to join the meeting next week?  If not, can you contact <span class="mention" data-id-db="ab2b16ef-1928-4788-ad9c-263300ace094">@Terry Thompson</span> to let them know?</p>`
	mentionNodes, err = tagsFromStringRegex(html)
	// Make sure we get an error. Any bad tags should fail the entire parse
	assert.Error(t, err)
	assert.Len(t, mentionNodes, 0)

	// Redacted Example from ECHIMP
	html = `<span><span><span><span><span><span><span><span>On December X, 20XX, we issued CR XXXXXX, Medicare Administrative Contractors (MACs) Updating Their Systems to Integrate with REDACTED, explaining the implementation process for the REDACTED (XXX) provider telephone survey.  According to the CR’s Attachment B, Estimated Implementation Schedule, there is a 12 to 16 week process from design to go-live for each MAC. </span>, is not a valid value for TagType error parsing html mention <span><span><span><span><span><span><span><span>We plan to implement this CR using a phased approach, in this order:</span>`
	mentionNodes, err = tagsFromStringRegex(html)
	// Make sure we get an error back as spans are only allowed when they are tags
	assert.Error(t, err)
	assert.Len(t, mentionNodes, 0)
}

func TestHTMLMentionFromString(t *testing.T) {
	tag1UUID := "4744bb54-c7d3-485a-9985-fdab4b86d28d"
	tag1Name := "Alexander Stark"
	tag1Type := TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id-db="` + tag1UUID + `">@` + tag1Name + `</span>`
	tag2UUID := "ab2b16ef-1928-4788-ad9c-263300ace094"
	tag2Name := "Terry Thompson"
	tag2Type := TagTypeUserAccount
	tag2 := `<span data-type="mention" tag-type="` + string(tag2Type) + `" class="mention" data-id-db="` + tag2UUID + `">@` + tag2Name + `</span>`
	tag3Name := "Salesforce"
	tag3Type := TagTypeGroupGrbReviewers
	tag3 := `<span data-type="mention" tag-type="` + string(tag3Type) + `" class="mention">@` + tag3Name + `</span>`
	htmlMention := `<p>Hey ` + tag1 + `!  Will you be able to join the meeting next week?  If not, can you contact ` + tag2 + ` to let them know?</p> We are planning on using the ` + tag3 + `solution.`
	taggedContent, err := NewTaggedHTMLFromString(htmlMention)
	assert.NoError(t, err)
	assert.Len(t, taggedContent.Tags, 3)

	mention1 := taggedContent.Tags[0]
	mention2 := taggedContent.Tags[1]
	mention3 := taggedContent.Tags[2]
	assert.EqualValues(t, tag1Type, mention1.TagType)
	assert.EqualValues(t, tag2Type, mention2.TagType)
	assert.EqualValues(t, tag3Type, mention3.TagType)
}
