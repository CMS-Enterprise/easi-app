package services

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchMetrics returns a service for fetching a metrics digest
func NewFetchMetrics(
	fetchSystemIntakeMetrics func(time.Time, time.Time) (models.SystemIntakeMetrics, error),
) func(ctx context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error) {
	return func(ctx context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error) {
		systemIntakeMetrics, _ := fetchSystemIntakeMetrics(startTime, endTime)
		systemIntakeMetrics.StartTime = startTime
		systemIntakeMetrics.EndTime = endTime
		metricsDigest := models.MetricsDigest{
			SystemIntakeMetrics: systemIntakeMetrics,
		}
		return metricsDigest, nil
	}
}
