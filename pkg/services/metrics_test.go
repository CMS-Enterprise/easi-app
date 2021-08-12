package services

import (
	"context"
	"errors"
	"time"

	"github.com/facebookgo/clock"
	"github.com/guregu/null"
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
		accessibilityRequestMetrics.StartTime = systemIntakeMetrics.StartTime
		accessibilityRequestMetrics.EndTime = systemIntakeMetrics.EndTime

		metricsDigest, err := fetchMetrics(context.Background(), startTime, endTime)

		s.NoError(err)
		s.Equal(models.MetricsDigest{SystemIntakeMetrics: systemIntakeMetrics, AccessibilityRequestMetrics: accessibilityRequestMetrics}, metricsDigest)
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

func (s ServicesTestSuite) TestNewFetchAccessibilityMetrics() {
	fetchMetrics := func() ([]models.AccessibilityMetricsLine, error) {
		janFifth := time.Date(2020, 01, 05, 0, 0, 0, 0, time.UTC)
		aprilTenth := time.Date(2021, 04, 10, 0, 0, 0, 0, time.UTC)

		return []models.AccessibilityMetricsLine{
			{Name: "Name 1", LCID: "C3PO", Status: "OPEN", CreatedAt: janFifth, InitialTestDate: null.TimeFrom(janFifth),
				InitialTestScore: null.IntFrom(78), EarliestPassingTestDate: null.TimeFrom(aprilTenth), MostRecentRemediationScore: null.IntFrom(96), TestCount: 3, FailedTestCount: 2},
			{Name: "Name 2", LCID: "OBI1", Status: "CLOSED", CreatedAt: janFifth, StatusCreatedAt: aprilTenth},
		}, nil
	}

	s.Run("golden path", func() {
		data, err := NewFetchAccessibilityMetrics(fetchMetrics)()
		s.NoError(err)

		s.Equal([][]string{
			{"Request Name", "Lifecycle ID", "Request Status", "Date Opened", "Date Closed", "Initial Test Date", "Initial Test Score", "Date of Passing Test", "Most Recent Remediation Score", "Total Tests", "Failed Tests"},
			{"Name 1", "C3PO", "OPEN", "01/05/2020", "", "01/05/2020", "78", "04/10/2021", "96", "3", "2"},
			{"Name 2", "OBI1", "CLOSED", "01/05/2020", "04/10/2021", "", "", "", "", "0", "0"},
		}, data)
	})

	s.Run("fails if fetchMetrics fails", func() {
		failFetchMetrics := func() ([]models.AccessibilityMetricsLine, error) {
			return nil, errors.New("failed to fetch metrics")
		}
		_, err := NewFetchAccessibilityMetrics(failFetchMetrics)()
		s.Error(err)
	})
}
