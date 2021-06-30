package models

// MetricsDigest contains a set of metrics
type MetricsDigest struct {
	SystemIntakeMetrics         SystemIntakeMetrics         `json:"system_intake"`
	AccessibilityRequestMetrics AccessibilityRequestMetrics `json:"accessibility_request"`
}
