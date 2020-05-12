package validate

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

func (s ValidateTestSuite) TestRequireNullBool() {
	s.Run("nullBool is invalid", func() {
		s.True(RequireNullBool(null.Bool{}))
	})
	s.Run("nullBool is valid", func() {
		s.False(RequireNullBool(null.BoolFrom(true)))
	})
}

func (s ValidateTestSuite) TestRequireNullString() {
	s.Run("nullString is invalid", func() {
		s.True(RequireNullString(null.String{}))
	})
	s.Run("nullString is valid", func() {
		s.False(RequireNullString(null.StringFrom("string")))
	})
}

func (s ValidateTestSuite) TestRequireString() {
	s.Run("string is invalid", func() {
		s.True(RequireString(""))
	})
	s.Run("string is valid", func() {
		s.False(RequireString("string"))
	})
}

func (s ValidateTestSuite) TestRequireTime() {
	s.Run("time is a zero time", func() {
		s.True(RequireTime(time.Time{}))
	})
	s.Run("time is valid", func() {
		s.False(RequireTime(time.Now().UTC()))
	})
}

func (s ValidateTestSuite) TestRequireUUID() {
	s.Run("uuid is nil", func() {
		s.True(RequireUUID(uuid.UUID{}))
	})
	s.Run("uuid is valid", func() {
		s.False(RequireUUID(uuid.New()))
	})
}
