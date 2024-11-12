package models

import (
	"bytes"
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io"
	"regexp"

	"github.com/google/uuid"
	"github.com/samber/lo"
	html2 "golang.org/x/net/html"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/sanitization"
)

var (
	spanRe      = regexp.MustCompile(`<span[^>]*>.*?</span>`)
	attributeRe = regexp.MustCompile(`(\S+)="([^"]+)"`)
	innerHTMLRe = regexp.MustCompile(`>([^<]*)<`)
)

// TaggedHTML Is the input type for HTML that could contain tags
type TaggedHTML TaggedContent

const mentionTagTemplate = `<span data-type="mention" tag-type="{{.Type}}" class="mention" data-id="{{.EntityRaw}}" ` +
	`{{if .EntityDB}}data-id-db="{{.EntityDB}}" {{end}}` +
	`data-label="{{.DataLabel}}">{{.InnerHTML}}</span>`

// TaggedContent represents rich text HTML with possible tagged HTML mention
type TaggedContent struct {
	RawContent HTML
	Mentions   []*HTMLMention // These are the parsed content of the HTML, and a representation of how the data represented in an individual mention HTML tag
	Tags       []*Tag         // Tag is a representation of a tag record in the database.
}

// HTMLMention represents metadata about an entity tagged in text
type HTMLMention struct {
	RawHTMLNode html2.Node
	RawHTML     HTML
	Type        TagType
	DataLabel   string
	EntityRaw   string
	InnerHTML   string
	EntityUUID  *uuid.UUID
	EntityIntID *int
	EntityDB    interface{}
	//Entity      *TaggedEntity
}

//// ToTemplate converts and sanitizes the TaggedHTML type to a template.HTML struct
//func (th *TaggedHTML) ToTemplate() template.HTML {
//	if th == nil {
//		return ""
//	}
//
//	sanitizedHTML := sanitization.SanitizeHTML(*th.)
//	return template.HTML(sanitizedHTML) //nolint //the html is sanitized again on the previous line so we can ignore the warning about
//}

//// ValueOrEmptyString returns either the value of the html or an empty string if nil
//func (th *TaggedHTML) ValueOrEmptyString() string {
//	if th != nil {
//		return string(*th)
//	}
//
//	return ""
//}

// ValueOrEmptyHTML returns either the value of the html or an empty TaggedHTML type if nil
//func (th *TaggedHTML) ValueOrEmptyHTML() TaggedHTML {
//	if th != nil {
//		return *th
//	}
//
//	return ""
//}

// StringPointer casts an TaggedHTML pointer to a string pointer
//func (th *TaggedHTML) StringPointer() *string {
//	return (*string)(th)
//}

// UnmarshalGQLContext unmarshals the data from graphql to the TaggedHTML type
func (th *TaggedHTML) UnmarshalGQLContext(_ context.Context, v interface{}) error {
	rawHTML, ok := v.(string)
	if !ok {
		return errors.New("invalid TaggedHTML")
	}

	// Sanitize the HTML string
	sanitizedHTMLString := sanitization.SanitizeHTML(rawHTML)
	tc, err := NewTaggedContentFromString(sanitizedHTMLString)
	if err != nil {
		return err
	}
	*th = TaggedHTML(tc)
	return nil
}

// MarshalGQLContext marshals the TaggedHTML type to JSON to return to graphQL
func (th TaggedHTML) MarshalGQLContext(ctx context.Context, w io.Writer) error {
	logger := appcontext.ZLogger(ctx)

	jsonValue, err := json.Marshal(th.RawContent)
	if err != nil {
		logger.Info("invalid TaggedHTML")
		return fmt.Errorf("failed to marshal TaggedHTMLto JSON: %w", err)
	}

	if _, err := w.Write(jsonValue); err != nil {
		return fmt.Errorf("failed to write TaggedHTML to writer: %w", err)
	}

	return nil
}

// UniqueMentions returns a slices that are unique
func (th TaggedHTML) UniqueMentions() []*HTMLMention {
	uniqueMentions := lo.UniqBy(th.Mentions, func(mention *HTMLMention) string {

		key := fmt.Sprint(mention.Type, mention.EntityRaw) //The entity raw, and tag type will be unique.
		return key
	})

	return uniqueMentions
}

// ToTaggedContent casts the input to TaggedContent
func (th TaggedHTML) ToTaggedContent() TaggedContent {
	return TaggedContent(th)
}

// NewTaggedContentFromString converts a rawString into TaggedHTMl. It will store the input string as the raw content,
// and then sanitize and parse the input.
func NewTaggedContentFromString(htmlString string) (TaggedContent, error) {
	sanitized := sanitization.SanitizeHTML(htmlString)

	mentions, err := htmlMentionsFromStringRegex(sanitized)
	if err != nil {
		return TaggedContent{}, err
	}

	return TaggedContent{
		RawContent: HTML(sanitized),
		Mentions:   mentions,
	}, nil
}

func htmlMentionsFromStringRegex(htmlString string) ([]*HTMLMention, error) {
	mentionStrings, err := extractHTMLSpansRegex(htmlString)
	if err != nil {
		return nil, err
	}
	var (
		mentions []*HTMLMention
		errs     []error
	)

	for _, mentionString := range mentionStrings {
		htmlMention, err := parseHTMLMentionTagRegEx(mentionString)
		if err != nil {
			errs = append(errs, fmt.Errorf("error parsing html mention %s, %w", mentionString, err))
		}

		mentions = append(mentions, &htmlMention)
	}

	if len(errs) > 1 {
		return mentions, fmt.Errorf("issues encountered parsing html Mentions . %v", errs)
	}

	return mentions, nil
}

func extractHTMLSpansRegex(htmlString string) ([]string, error) {
	return spanRe.FindAllString(htmlString, -1), nil
}

func parseHTMLMentionTagRegEx(mention string) (HTMLMention, error) {
	attributes := extractAttributes(mention)
	innerHTML := extractInnerHTML(mention)

	tagType := TagType(attributes["tag-type"])
	if err := tagType.Validate(); err != nil {
		return HTMLMention{}, err
	}

	class := attributes["class"]
	if class != "mention" {
		return HTMLMention{}, fmt.Errorf("this is not a valid mention provided class is: %s", class)
	}

	return HTMLMention{
		RawHTML:   HTML(mention),
		InnerHTML: innerHTML,
		Type:      tagType,
		EntityRaw: attributes["data-id"],
		DataLabel: attributes["data-label"],
		EntityDB:  attributes["data-id-db"],
	}, nil
}

func extractAttributes(match string) map[string]string {
	attributeMatches := attributeRe.FindAllStringSubmatch(match, -1)

	// Create a map to store the attribute key-value pairs
	attributes := map[string]string{}

	// Iterate over the matches and extract the attribute name and value
	for _, attributeMatch := range attributeMatches {
		if len(attributeMatch) < 3 {
			continue
		}

		attributeName := attributeMatch[1]
		attributeValue := attributeMatch[2]

		attributes[attributeName] = attributeValue
	}

	return attributes
}

func extractInnerHTML(match string) string {

	// Find the match of the pattern in the input string
	innerHTMLMatch := innerHTMLRe.FindStringSubmatch(match)

	// Return the inner html
	if len(innerHTMLMatch) > 1 {
		return innerHTMLMatch[1]
	}

	return ""
}

func (hm HTMLMention) ToTag(taggedField string, taggedTable string, taggedContentID uuid.UUID) Tag {
	return Tag{
		TagType:            hm.Type,
		TaggedField:        taggedField,
		TaggedContentTable: taggedTable,
		TaggedContentID:    taggedContentID,
		EntityRaw:          hm.EntityRaw,
		EntityUUID:         hm.EntityUUID,
		EntityIntID:        hm.EntityIntID,
	}
}

func (hm HTMLMention) ToHTML() (HTML, error) { //nolint:all // it is desirable that hTML is not exported, so we can enforce sanitization
	// Create a new template and parse the template string
	t, err := template.New("webpage").Parse(mentionTagTemplate)
	if err != nil {
		return "", err
	}

	var buffer bytes.Buffer
	if err := t.Execute(&buffer, &hm); err != nil {
		return "", err
	}

	return HTML(buffer.String()), nil
}

func TagArrayFromHTMLMentions(taggedField string, taggedTable string, taggedContentID uuid.UUID, mentions []*HTMLMention) []*Tag {
	var tags []*Tag

	for _, mention := range mentions {
		tag := mention.ToTag(taggedField, taggedTable, taggedContentID)
		tags = append(tags, &tag)
	}

	return tags
}

func (th *TaggedContent) Scan(src interface{}) error {
	switch t := src.(type) {
	case string:
		tagHTML, err := NewTaggedContentFromString(t)
		if err != nil {
			return err
		}
		*th = tagHTML

	case []byte:
		tagHTML, err := NewTaggedContentFromString(string(t))
		if err != nil {
			return err
		}
		*th = tagHTML
	}

	return nil
}

func (th TaggedContent) Value() (driver.Value, error) {
	return string(th.RawContent), nil
}

func (th *TaggedHTML) Scan(src interface{}) error {
	switch t := src.(type) {
	case string:
		tagHTML, err := NewTaggedContentFromString(t)
		if err != nil {
			return err
		}
		*th = TaggedHTML(tagHTML)

	case []byte:
		tagHTML, err := NewTaggedContentFromString(string(t))
		if err != nil {
			return err
		}
		*th = TaggedHTML(tagHTML)
	}

	return nil
}

func (th TaggedHTML) Value() (driver.Value, error) {
	return string(th.RawContent), nil
}
