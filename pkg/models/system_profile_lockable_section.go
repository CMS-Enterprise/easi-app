package models

// SystemProfileLockableSection represents Sections of the system profile form that can be locked for editing
type SystemProfileLockableSection string

const (
	SystemProfileLockableSectionBusinessInformation   SystemProfileLockableSection = "BUSINESS_INFORMATION"
	SystemProfileLockableSectionImplementationDetails SystemProfileLockableSection = "IMPLEMENTATION_DETAILS"
	SystemProfileLockableSectionData                  SystemProfileLockableSection = "DATA"
	SystemProfileLockableSectionToolsAndSoftware      SystemProfileLockableSection = "TOOLS_AND_SOFTWARE"
	SystemProfileLockableSectionSubSystems            SystemProfileLockableSection = "SUB_SYSTEMS"
	SystemProfileLockableSectionTeam                  SystemProfileLockableSection = "TEAM"
)
