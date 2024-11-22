package models

import (
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
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
		return fmt.Sprint(tag.TagType, tag.TaggedContentID.String()) //The entity raw, and tag type will be unique.
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
	if class != "mention" {
		return Tag{}, fmt.Errorf("this is not a valid tag provided class is: %s", class)
	}

	id := attributes["data-id-db"]
	if len(id) < 1 {
		return Tag{}, errors.New("missing data-id in tag")
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
