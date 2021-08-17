package services

import (
	"context"
	"strconv"
	"time"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchMetrics returns a service for fetching a metrics digest
func NewFetchMetrics(
	_ Config,
	fetchSystemIntakeMetrics func(context.Context, time.Time, time.Time) (models.SystemIntakeMetrics, error),
	fetchAccessibilityRequestMetrics func(context.Context, time.Time, time.Time) (models.AccessibilityRequestMetrics, error),
) func(c context.Context, st time.Time, et time.Time) (models.MetricsDigest, error) {
	return func(ctx context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error) {
		systemIntakeMetrics, err := fetchSystemIntakeMetrics(ctx, startTime, endTime)
		if err != nil {
			appcontext.ZLogger(ctx).Error("failed to query system intake metrics", zap.Error(err))
			return models.MetricsDigest{}, &apperrors.QueryError{
				Err:       err,
				Model:     models.SystemIntakeMetrics{},
				Operation: apperrors.QueryFetch,
			}
		}
		systemIntakeMetrics.StartTime = startTime
		systemIntakeMetrics.EndTime = endTime

		accessibilityRequestMetrics, err := fetchAccessibilityRequestMetrics(ctx, startTime, endTime)
		if err != nil {
			appcontext.ZLogger(ctx).Error("failed to query accessibility request metrics", zap.Error(err))
			return models.MetricsDigest{}, &apperrors.QueryError{
				Err:       err,
				Model:     models.AccessibilityRequestMetrics{},
				Operation: apperrors.QueryFetch,
			}
		}
		accessibilityRequestMetrics.StartTime = startTime
		accessibilityRequestMetrics.EndTime = endTime

		metricsDigest := models.MetricsDigest{
			SystemIntakeMetrics:         systemIntakeMetrics,
			AccessibilityRequestMetrics: accessibilityRequestMetrics,
		}
		return metricsDigest, nil
	}
}

// NewFetchAccessibilityMetrics builds the datatype that converts into the csv for accessibility metrics
func NewFetchAccessibilityMetrics(
	fetchMetrics func() ([]models.AccessibilityMetricsLine, error),
) func() ([][]string, error) {
	return func() ([][]string, error) {
		lines, err := fetchMetrics()
		if err != nil {
			return nil, err
		}
		data := [][]string{{
			"Request Name",
			"Lifecycle ID",
			"Request Status",
			"Date Opened",
			"Date Closed",
			"Initial Test Date",
			"Initial Test Score",
			"Date of Passing Test",
			"Most Recent Remediation Score",
			"Total Tests",
			"Failed Tests"}}
		for _, line := range lines {
			var dateClosed, initialTestDate, initialTestScore, dateOfPassingTest, mostRecentRemediationScore string
			if line.Status == models.AccessibilityRequestStatusClosed {
				dateClosed = line.StatusCreatedAt.Format("01/02/2006")
			}
			if line.InitialTestDate.Valid {
				initialTestDate = line.InitialTestDate.Time.Format("01/02/2006")
			}
			if line.InitialTestScore.Valid {
				initialTestScore = strconv.Itoa(int(line.InitialTestScore.Int64))
			}
			if line.EarliestPassingTestDate.Valid {
				dateOfPassingTest = line.EarliestPassingTestDate.Time.Format("01/02/2006")
			}
			if line.MostRecentRemediationScore.Valid {
				mostRecentRemediationScore = strconv.Itoa(int(line.MostRecentRemediationScore.Int64))
			}
			data = append(data, []string{
				line.Name,
				line.LCID,
				string(line.Status),
				line.CreatedAt.Format("01/02/2006"),
				dateClosed,
				initialTestDate,
				initialTestScore,
				dateOfPassingTest,
				mostRecentRemediationScore,
				strconv.Itoa(line.TestCount),
				strconv.Itoa(line.FailedTestCount),
			})
		}
		return data, nil
	}
}
