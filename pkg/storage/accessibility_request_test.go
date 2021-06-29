package storage

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/facebookgo/clock"

	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestFetchAccessibilityRequestMetrics() {
	ctx := context.Background()

	mockClock := clock.NewMock()
	settableClock := testhelpers.SettableClock{Mock: mockClock}
	s.store.clock = &settableClock

	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	// create a random year to avoid test collisions
	// uses postgres max year minus 1000000
	rand.Seed(time.Now().UnixNano())
	// #nosec G404
	endYear := rand.Intn(294276)
	endDate := time.Date(endYear, 0, 0, 0, 0, 0, 0, time.UTC)
	startDate := endDate.AddDate(0, -1, 0)
	var startedTests = []struct {
		name          string
		createdAt     time.Time
		expectedCount int
	}{
		{"start time is included", startDate, 1},
		{"end time is not included", endDate, 1},
		{"mid time is included", startDate.AddDate(0, 0, 1), 2},
		{"before time is not included", startDate.AddDate(0, 0, -1), 2},
		{"after time is not included", endDate.AddDate(0, 0, 1), 2},
	}
	for _, tt := range startedTests {
		s.Run(fmt.Sprintf("%s for started count", tt.name), func() {
			settableClock.Set(tt.createdAt)
			request := testhelpers.NewAccessibilityRequest(intake.ID)
			_, err := s.store.CreateAccessibilityRequestAndInitialStatusRecord(ctx, &request)
			s.NoError(err)

			metrics, err := s.store.FetchAccessibilityRequestMetrics(ctx, startDate, endDate)

			s.NoError(err)
			s.Equal(tt.expectedCount, metrics.CreatedAndOpen)
		})
	}
}
