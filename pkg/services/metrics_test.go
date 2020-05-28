package services

import (
	"context"
	"errors"
	"time"

	"github.com/facebookgo/clock"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestNewFetchMetrics() {
	serviceClock := clock.NewMock()
	systemIntakeMetrics := models.SystemIntakeMetrics{}
	fetchSystemIntakeMetrics := func(time.Time, time.Time) (models.SystemIntakeMetrics, error) {
		return systemIntakeMetrics, nil
	}

	s.Run("golden path returns metric digest", func() {
		fetchMetrics := NewFetchMetrics(s.logger, fetchSystemIntakeMetrics)
		startTime := serviceClock.Now()
		systemIntakeMetrics.StartTime = startTime
		endTime := serviceClock.Now()
		systemIntakeMetrics.EndTime = endTime

		metricsDigest, err := fetchMetrics(context.Background(), startTime, endTime)

		s.NoError(err)
		s.Equal(models.MetricsDigest{SystemIntakeMetrics: systemIntakeMetrics}, metricsDigest)
	})

	s.Run("returns error if service fails", func() {
		failFetchSystemIntakeMetrics := func(time.Time, time.Time) (models.SystemIntakeMetrics, error) {
			return systemIntakeMetrics, errors.New("failed to fetch system intake metrics")
		}
		fetchMetrics := NewFetchMetrics(s.logger, failFetchSystemIntakeMetrics)
		startTime := serviceClock.Now()
		endTime := serviceClock.Now()

		_, err := fetchMetrics(context.Background(), startTime, endTime)

		s.Error(err)
		s.IsType(&apperrors.QueryError{}, err)
	})

}
