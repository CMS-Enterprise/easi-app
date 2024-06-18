package validate

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ValidateTestSuite) TestRequireNullBool() {
	s.Run("nullBool is invalid", func() {
		s.True(RequireNullBool(null.Bool{}))
	})
	s.Run("nullBool is valid", func() {
		s.False(RequireNullBool(null.BoolFrom(true)))
	})
}

func (s *ValidateTestSuite) TestRequireNullString() {
	s.Run("nullString is invalid", func() {
		s.True(RequireNullString(null.String{}))
	})
	s.Run("nullString is valid", func() {
		s.False(RequireNullString(null.StringFrom("string")))
	})
}

func (s *ValidateTestSuite) TestRequireString() {
	s.Run("string is invalid", func() {
		s.True(RequireString(""))
	})
	s.Run("string is valid", func() {
		s.False(RequireString("string"))
	})
}

func (s *ValidateTestSuite) TestRequireTime() {
	s.Run("time is a zero time", func() {
		s.True(RequireTime(time.Time{}))
	})
	s.Run("time is valid", func() {
		s.False(RequireTime(time.Now().UTC()))
	})
}

func (s *ValidateTestSuite) TestRequireUUID() {
	s.Run("uuid is nil", func() {
		s.True(RequireUUID(uuid.UUID{}))
	})
	s.Run("uuid is valid", func() {
		s.False(RequireUUID(uuid.New()))
	})
}

func (s *ValidateTestSuite) TestRequireInt() {
	s.Run("int pointer is nil", func() {
		var x *int
		s.True(RequireInt(x))
	})
	s.Run("int pointer is not nil", func() {
		x := 5
		s.False(RequireInt(&x))
	})
}

func (s *ValidateTestSuite) TestFundingNumberInvalid() {
	s.Run("funding number has letters", func() {
		s.True(FundingNumberInvalid("AAAAAA"))
	})
	s.Run("funding number is greater than 6 digits", func() {
		s.True(FundingNumberInvalid("999999999"))
	})
	s.Run("funding number is fewer than 6 digits", func() {
		s.True(FundingNumberInvalid("1"))
	})
	s.Run("funding number is valid", func() {
		s.False(FundingNumberInvalid("123456"))
	})
}

func (s *ValidateTestSuite) TestRequireCostPhase() {
	s.Run("cost phase pointer is nil", func() {
		var p *models.LifecycleCostPhase
		s.True(RequireCostPhase(p))
	})
	s.Run("int pointer is nil", func() {
		p := models.LifecycleCostPhaseOPERATIONMAINTENANCE
		s.False(RequireCostPhase(&p))
	})
}
