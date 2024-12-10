package models

import (
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

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/sanitization"
)

var (
	spanRe      = regexp.MustCompile(`<span[^>]*>.*?</span>`)
	attributeRe = regexp.MustCompile(`(\S+)="([^"]+)"`)
)

// TaggedHTML Is the input type for HTML that could contain tags
type TaggedHTML struct {
	RawContent HTML
	Tags       []*Tag
}

// UnmarshalGQLContext unmarshals the data from graphql to the TaggedHTML type
func (th *TaggedHTML) UnmarshalGQLContext(_ context.Context, v interface{}) error {
	rawHTML, ok := v.(string)
	if !ok {
		return errors.New("invalid TaggedHTML")
	}

	tc, err := NewTaggedHTMLFromString(rawHTML)
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
		return fmt.Sprint(tag.TagType, tag.TaggedContentID.String())
	})

	return uniqueTags
}

// NewTaggedHTMLFromString converts an htmlString into TaggedHTML. It will store the input string as the raw content,
// and then sanitize and parse the input.
func NewTaggedHTMLFromString(htmlString string) (TaggedHTML, error) {
	// sanitize
	htmlString = sanitization.SanitizeTaggedHTML(htmlString)
	tags, err := tagsFromStringRegex(htmlString)
	if err != nil {
		return TaggedHTML{}, err
	}

	return TaggedHTML{
		RawContent: HTML(htmlString),
		Tags:       tags,
	}, nil
}

func tagsFromStringRegex(htmlString string) ([]*Tag, error) {
	tagStrings := spanRe.FindAllString(htmlString, -1)

	var tags []*Tag
	for _, tagString := range tagStrings {
		parsedTag, err := parseTagRegEx(tagString)
		if err != nil {
			return nil, err
		}

		tags = append(tags, &parsedTag)
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
	if class != "mention" {
		return Tag{}, fmt.Errorf("%s is not a valid class for tag", class)
	}

	// if tag type is NOT a user account, there will be no UUID to parse
	if tagType != TagTypeUserAccount {
		return Tag{
			TagType: tagType,
		}, nil
	}

	id := attributes["data-id-db"]
	if len(id) < 1 {
		return Tag{}, errors.New("missing data-id-db in tag")
	}

	parsed, err := uuid.Parse(id)
	if err != nil {
		return Tag{}, fmt.Errorf("failed to prase UUID when parsing tags: %w", err)
	}

	return Tag{
		TagType:         tagType,
		TaggedContentID: parsed,
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

func (th *TaggedHTML) Scan(src interface{}) error {
	switch t := src.(type) {
	case string:
		tagHTML, err := NewTaggedHTMLFromString(t)
		if err != nil {
			return err
		}
		*th = tagHTML

	case []byte:
		tagHTML, err := NewTaggedHTMLFromString(string(t))
		if err != nil {
			return err
		}
		*th = tagHTML
	}

	return nil
}

func (th TaggedHTML) Value() (driver.Value, error) {
	return string(th.RawContent), nil
}

func (th TaggedHTML) ToTemplate() template.HTML {
	sanitized := sanitization.SanitizeTaggedHTML(th.RawContent)
	return template.HTML(sanitized) //nolint
}
