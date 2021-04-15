package testhelpers

import (
	"time"

	"github.com/cmsgov/easi-app/pkg/models"

	"github.com/google/uuid"
)

// NewTestDate generates an test date to use in tests
func NewTestDate(requestID uuid.UUID) models.TestDate {
	now := time.Now()
	score := 30
	return models.TestDate{
		RequestID: requestID,
		TestType:  models.TestDateTestTypeInitial,
		Date:      now,
		Score:     &score,
	}
}
