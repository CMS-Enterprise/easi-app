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
