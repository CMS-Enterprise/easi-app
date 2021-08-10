package storage

import "github.com/cmsgov/easi-app/pkg/models"

// FetchAccessibilityMetrics fetches data about accessibility requests
func (s *Store) FetchAccessibilityMetrics() ([]models.AccessibilityMetricsLine, error) {
	const accessibilityMetricsSQL = `
	SELECT 
		aras.name,
		aras.status,
		aras.created_at,
		aras.status_created_at,
		system_intakes.lcid,
		aggregates.test_dates[1] AS initial_test_date,
		aggregates.test_scores[1] AS initial_test_score,
		COALESCE(aggregates.test_count, 0) AS test_count,
		COALESCE(aggregates.failed_test_count, 0) AS failed_test_count,
		aggregates.earliest_passing_test_date,
		aggregates.remediation_scores[1] AS most_recent_remediation_score
	FROM
		accessibility_requests_and_statuses AS aras
		LEFT JOIN system_intakes ON system_intakes.id = aras.intake_id
		LEFT JOIN (SELECT 
					test_dates.request_id,
					ARRAY_AGG(test_dates.date ORDER BY test_dates.date ASC) AS test_dates,
					ARRAY_AGG(test_dates.score ORDER BY test_dates.date ASC) AS test_scores, 
					COUNT(test_dates.id) AS test_count,
					COUNT(test_dates.id) FILTER (WHERE test_dates.score < 100) AS failed_test_count,
					MIN(test_dates.date) FILTER (WHERE test_dates.score = 100) AS earliest_passing_test_date, 
					ARRAY_AGG(test_dates.score ORDER BY test_dates.date DESC) FILTER (WHERE test_dates.test_type = 'REMEDIATION') AS remediation_scores
					FROM test_dates
					GROUP BY (test_dates.request_id)) AS aggregates ON aggregates.request_id = aras.id
	ORDER BY aras.created_at ASC`

	var metrics []models.AccessibilityMetricsLine
	err := s.db.Select(&metrics, accessibilityMetricsSQL)

	return metrics, err
}
