package models

import (
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"regexp"

	"github.com/samber/lo"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/sanitization"
)

var (
	spanRe      = regexp.MustCompile(`<span[^>]*>.*?</span>`)
	attributeRe = regexp.MustCompile(`(\S+)="([^"]+)"`)
)

// TaggedHTML Is the input type for HTML that could contain tags
type TaggedHTML TaggedContent

// TaggedContent represents rich text HTML with possible tagged HTML
type TaggedContent struct {
	RawContent HTML
	Tags       []*Tag
}

// UnmarshalGQLContext unmarshals the data from graphql to the TaggedHTML type
func (th *TaggedHTML) UnmarshalGQLContext(_ context.Context, v interface{}) error {
	rawHTML, ok := v.(string)
	if !ok {
		return errors.New("invalid TaggedHTML")
	}

	tc, err := NewTaggedContentFromString(rawHTML)
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

func (th TaggedHTML) UniqueTags() []*Tag {
	uniqueTags := lo.UniqBy(th.Tags, func(tag *Tag) string {

		//key := fmt.Sprint(tag.TagType, tag.EntityRaw) //The entity raw, and tag type will be unique.
		return ""
	})

	return uniqueTags
}

// ToTaggedContent casts the input to TaggedContent
func (th TaggedHTML) ToTaggedContent() TaggedContent {
	return TaggedContent(th)
}

// NewTaggedContentFromString converts a rawString into TaggedHTMl. It will store the input string as the raw content,
// and then sanitize and parse the input.
func NewTaggedContentFromString(htmlString string) (TaggedContent, error) {
	tags, err := tagsFromStringRegex(htmlString)
	if err != nil {
		return TaggedContent{}, err
	}

	return TaggedContent{
		RawContent: HTML(sanitization.SanitizeHTML(htmlString)),
		Tags:       tags,
	}, nil
}

func tagsFromStringRegex(htmlString string) ([]*Tag, error) {
	tagStrings := spanRe.FindAllString(htmlString, -1)

	var (
		tags []*Tag
		errs []error
	)

	for _, tagString := range tagStrings {
		parsedTag, err := parseTagRegEx(tagString)
		if err != nil {
			errs = append(errs, fmt.Errorf("error parsing html tag %s, %w", tagString, err))
			continue
		}

		tags = append(tags, &parsedTag)
	}

	if len(errs) > 1 {
		return tags, fmt.Errorf("issues encountered parsing html Tags . %v", errs)
	}

	return tags, nil
}

func parseTagRegEx(tag string) (Tag, error) {
	attributes := extractAttributes(tag)

	tagType := TagType(attributes["tag-type"])
	if !tagType.IsValid() {
		return Tag{}, fmt.Errorf("%s is not a valid tag type", tagType)
	}

	class := attributes["class"]
	if class != "tag" {
		return Tag{}, fmt.Errorf("this is not a valid tag provided class is: %s", class)
	}

	return Tag{
		//TagType:   tagType,
		EntityRaw: attributes["data-id"],
		//DataLabel:  attributes["data-label"],
		//EntityUUID: attributes["data-id-db"],
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
