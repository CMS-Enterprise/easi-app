package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, add a new version for it in pkg/cedar/intake/translation/schema_versions.go
// and update the associated version in cmd/gen_intake_schema/main.go

// EASILifecycleCost represents a lifecycle cost item submitted through EASi as part of a business case
type EASILifecycleCost struct {
	BusinessCaseID string `json:"businessCaseId"`
	Cost           string `json:"cost"`
	ID             string `json:"id"`
	Phase          string `json:"phase"`
	Solution       string `json:"solution"`
	Year           string `json:"year"`
}
