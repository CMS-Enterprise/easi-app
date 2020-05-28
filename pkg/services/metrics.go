package services

import (
	"context"
	"time"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchMetrics returns a service for fetching a metrics digest
func NewFetchMetrics(
	fetchSystemIntakeMetrics func(time.Time, time.Time) (models.SystemIntakeMetrics, error),
) func(ctx context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error) {
	return func(ctx context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error) {
		logger, _ := appcontext.Logger(ctx)
		systemIntakeMetrics, err := fetchSystemIntakeMetrics(startTime, endTime)
		if err != nil {
			logger.Error("failed to query system intake metrics", zap.Error(err))
			return models.MetricsDigest{}, &apperrors.QueryError{
				Err:       err,
				Model:     models.SystemIntakeMetrics{},
				Operation: apperrors.QueryFetch,
			}
		}
		systemIntakeMetrics.StartTime = startTime
		systemIntakeMetrics.EndTime = endTime
		metricsDigest := models.MetricsDigest{
			SystemIntakeMetrics: systemIntakeMetrics,
		}
		return metricsDigest, nil
	}
}
