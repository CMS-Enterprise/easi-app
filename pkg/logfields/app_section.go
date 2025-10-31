package logfields

import "go.uber.org/zap"

// these constants represents the keys to get these data fields out of a zap logger.
const (
	AppSectionKey string = "app_section"

	CedarPublisherSectionKey       string = "cedar_publisher"
	SchedularSectionKey            string = "scheduler"
	SystemProfileLockingSectionKey string = "system_profile_locking"
)

// CedarPublisherAppSection provides the zap field for specifying the part of the application is the CEDAR publisher
var CedarPublisherAppSection = zap.String(AppSectionKey, CedarPublisherSectionKey)

// SchedulerAppSection provides the zap field for specifying the part of the application is the scheduler
var SchedulerAppSection = zap.String(AppSectionKey, SchedularSectionKey)

// SystemProfileLockingAppSection provides the zap field for specifying the part of the application is the system profile locking service
var SystemProfileLockingAppSection = zap.String(AppSectionKey, SystemProfileLockingSectionKey)
