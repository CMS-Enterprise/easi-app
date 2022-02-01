package models

// EASILifecycleCost represents a lifecycle cost item
type EASILifecycleCost struct {
	BusinessCaseID string `json:"businessCaseId"`
	Cost           string `json:"cost"`
	ID             string `json:"id"`
	Phase          string `json:"phase"`
	Solution       string `json:"solution"`
	Year           string `json:"year"`
}
