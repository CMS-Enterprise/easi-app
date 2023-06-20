package models

// ITGovTaskStatusesAdmin is a helper struct used by GQL to wrap a returned ITGovTaskStatuses, so section statuses can be calculated only when requested
type ITGovTaskStatusesAdmin struct {
	ParentStatus *ITGovTaskStatuses
}

// GRTMeetingStatus will calculate the status for the GRT Meeting for the IT gov admin view
func (i *ITGovTaskStatusesAdmin) GRTMeetingStatus() string {
	return "NOT IMPLEMENTED"
}
