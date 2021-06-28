package services

import (
	"context"
	"errors"
	"time"

	"github.com/facebookgo/clock"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestNewFetchMetrics() {
	serviceClock := clock.NewMock()
	serviceConfig := NewConfig(zap.NewNop(), nil)
	serviceConfig.clock = serviceClock
	systemIntakeMetrics := models.SystemIntakeMetrics{}
	fetchSystemIntakeMetrics := func(context.Context, time.Time, time.Time) (models.SystemIntakeMetrics, error) {
		return systemIntakeMetrics, nil
	}
	accessibilityRequestMetrics := models.AccessibilityRequestMetrics{}
	fetchAccessibilityRequestMetrics := func(context.Context, time.Time, time.Time) (models.AccessibilityRequestMetrics, error) {
		return accessibilityRequestMetrics, nil
	}

	s.Run("golden path returns metric digest", func() {
		fetchMetrics := NewFetchMetrics(serviceConfig, fetchSystemIntakeMetrics, fetchAccessibilityRequestMetrics)
		startTime := serviceClock.Now()
		systemIntakeMetrics.StartTime = startTime
		endTime := serviceClock.Now()
		systemIntakeMetrics.EndTime = endTime

		metricsDigest, err := fetchMetrics(context.Background(), startTime, endTime)

		s.NoError(err)
		s.Equal(models.MetricsDigest{SystemIntakeMetrics: systemIntakeMetrics}, metricsDigest)
	})

	s.Run("returns error if system intake service fails", func() {
		failFetchSystemIntakeMetrics := func(context.Context, time.Time, time.Time) (models.SystemIntakeMetrics, error) {
			return systemIntakeMetrics, errors.New("failed to fetch system intake metrics")
		}
		fetchMetrics := NewFetchMetrics(serviceConfig, failFetchSystemIntakeMetrics, fetchAccessibilityRequestMetrics)
		startTime := serviceClock.Now()
		endTime := serviceClock.Now()

		_, err := fetchMetrics(context.Background(), startTime, endTime)

		s.Error(err)
		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error if accessibility request service fails", func() {
		failFetchAccessibilityRequestMetrics := func(context.Context, time.Time, time.Time) (models.AccessibilityRequestMetrics, error) {
			return accessibilityRequestMetrics, errors.New("failed to fetch accessibility request metrics")
		}
		fetchMetrics := NewFetchMetrics(serviceConfig, fetchSystemIntakeMetrics, failFetchAccessibilityRequestMetrics)
		startTime := serviceClock.Now()
		endTime := serviceClock.Now()

		_, err := fetchMetrics(context.Background(), startTime, endTime)

		s.Error(err)
		s.IsType(&apperrors.QueryError{}, err)
	})

}
