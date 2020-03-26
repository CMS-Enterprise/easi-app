package models

import "encoding/json"

func (s *ModelTestSuite) TestNullableStringMarshalJSON() {
	s.Run("Can marshal valid to string", func() {
		content := NullableString{}
		content.Valid = true
		content.String = "content"

		data, err := content.MarshalJSON()

		s.NoError(err, "Failed to marshall content")
		var actualString string
		err = json.Unmarshal(data, &actualString)
		s.NoError(err, "Failed to unmarshal content")
		s.Equal("content", actualString)
	})

	s.Run("Can marshal empty invalid to string", func() {
		content := NullableString{}

		data, err := content.MarshalJSON()

		s.NoError(err, "Failed to marshall content")
		var actualString string
		err = json.Unmarshal(data, &actualString)
		s.NoError(err, "Failed to unmarshal content")
		s.Equal("", actualString)
	})

	s.Run("Ignores string if invalid", func() {
		content := NullableString{}
		content.String = "content"

		data, err := content.MarshalJSON()

		s.NoError(err, "Failed to marshall content")
		var actualString string
		err = json.Unmarshal(data, &actualString)
		s.NoError(err, "Failed to unmarshal content")
		s.Equal("", actualString)
	})
}

func (s *ModelTestSuite) TestNullableStringUnmarshalJSON() {
	s.Run("Can unmarshal a string to valid", func() {
		expectedContent := NullableString{}
		expectedContent.Valid = true
		expectedContent.String = "content"
		actualContent := NullableString{}
		data, _ := json.Marshal("content")

		err := actualContent.UnmarshalJSON(data)

		s.NoError(err, "Failed to unmarshall content")
		s.Equal(expectedContent, actualContent)
	})

	s.Run("Can unmarshal empty string to valid", func() {
		expectedContent := NullableString{}
		expectedContent.Valid = true
		expectedContent.String = ""
		actualContent := NullableString{}
		data, _ := json.Marshal("")

		err := actualContent.UnmarshalJSON(data)

		s.NoError(err, "Failed to unmarshall content")
		s.Equal(expectedContent, actualContent)
	})
}
