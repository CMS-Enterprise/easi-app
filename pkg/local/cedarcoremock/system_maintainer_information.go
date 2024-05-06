package cedarcoremock

import (
	"time"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/models"
)

var mockSystemMaintainerInformation = map[string]*models.SystemMaintainerInformation{
	"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}": {
		AdHocAgileDeploymentFrequency:         zero.StringFrom("Every three weeks"),
		AgileUsed:                             true,
		AuthoritativeDatasource:               zero.StringFrom("Source control"),
		BusinessArtifactsOnDemand:             true,
		DataAtRestEncryptionKeyManagement:     zero.StringFrom("AWS KMS"),
		DeploymentFrequency:                   zero.StringFrom("Every two weeks"),
		DevCompletionPercent:                  zero.StringFrom("10-14%"),
		DevWorkDescription:                    zero.StringFrom("Designing and building the backend"),
		EcapParticipation:                     true,
		FrontendAccessType:                    zero.StringFrom("IPv4 and IPv6"),
		HardCodedIPAddress:                    true,
		IP6EnabledAssetPercent:                zero.StringFrom("Between 20% and 40%"),
		IP6TransitionPlan:                     zero.StringFrom("This system will be transitioned to IPv6"),
		IPEnabledAssetCount:                   50,
		LegalHoldCaseName:                     zero.StringFrom("Case Name"),
		LocallyStoredUserInformation:          true,
		MajorRefreshDate:                      zero.TimeFrom(time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC)),
		MultifactorAuthenticationMethod:       []zero.String{zero.StringFrom("Google Authenticator"), zero.StringFrom("Microsoft Authenticator")},
		MultifactorAuthenticationMethodOther:  zero.StringFrom("Other mfa method"),
		NetAccessibility:                      zero.StringFrom("Accessible to a CMS-internal network only"),
		NetworkTrafficEncryptionKeyManagement: zero.StringFrom("AWS KMS"),
		NoMajorRefresh:                        true,
		NoPersistentRecordsFlag:               true,
		NoPlannedMajorRefresh:                 true,
		OmDocumentationOnDemand:               true,
		PlansToRetireReplace:                  zero.StringFrom("Yes - Retire and Replace"),
		QuarterToRetireReplace:                zero.StringFrom("2"),
		RecordsManagementBucket:               []zero.String{zero.StringFrom("Bucket 1"), zero.StringFrom("Bucket 2")},
		RecordsManagementDisposalLocation:     zero.StringFrom("Recycle bin"),
		RecordsManagementDisposalPlan:         zero.StringFrom("Weekly deletion"),
		RecordsUnderLegalHold:                 true,
		SourceCodeOnDemand:                    true,
		SystemCustomization:                   zero.StringFrom("Less than 20%% customization"),
		SystemDesignOnDemand:                  true,
		SystemDataLocation:                    []zero.String{zero.StringFrom("Austin, TX")},
		SystemDataLocationNotes:               zero.StringFrom("Notes regarding system data location"),
		SystemProductionDate:                  zero.TimeFrom(time.Date(2022, 1, 1, 0, 0, 0, 0, time.UTC)),
		SystemRequirementsOnDemand:            true,
		TestPlanOnDemand:                      true,
		TestReportsOnDemand:                   true,
		TestScriptsOnDemand:                   true,
		YearToRetireReplace:                   zero.StringFrom("2027"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}": {
		AdHocAgileDeploymentFrequency:         zero.StringFrom("Daily"),
		AgileUsed:                             false,
		AuthoritativeDatasource:               zero.StringFrom("Wikipedia"),
		BusinessArtifactsOnDemand:             true,
		DataAtRestEncryptionKeyManagement:     zero.StringFrom("Encryption"),
		DeploymentFrequency:                   zero.StringFrom("Quarterly"),
		DevCompletionPercent:                  zero.StringFrom("75%"),
		DevWorkDescription:                    zero.StringFrom("Testing in production"),
		EcapParticipation:                     false,
		FrontendAccessType:                    zero.StringFrom("IPv4"),
		HardCodedIPAddress:                    false,
		IP6EnabledAssetPercent:                zero.StringFrom("0%"),
		IP6TransitionPlan:                     zero.StringFrom("This system will not be transitioned to IPv6"),
		IPEnabledAssetCount:                   0,
		LegalHoldCaseName:                     zero.StringFrom("Case hold"),
		LocallyStoredUserInformation:          false,
		MajorRefreshDate:                      zero.TimeFrom(time.Date(2025, 2, 2, 0, 0, 0, 0, time.UTC)),
		MultifactorAuthenticationMethod:       []zero.String{zero.StringFrom("Google Authenticator"), zero.StringFrom("Microsoft Authenticator")},
		MultifactorAuthenticationMethodOther:  zero.StringFrom("Other mfa methods"),
		NetAccessibility:                      zero.StringFrom("Accessible to public internet"),
		NetworkTrafficEncryptionKeyManagement: zero.StringFrom("Encryption"),
		NoMajorRefresh:                        false,
		NoPersistentRecordsFlag:               false,
		NoPlannedMajorRefresh:                 false,
		OmDocumentationOnDemand:               false,
		PlansToRetireReplace:                  zero.StringFrom("No"),
		QuarterToRetireReplace:                zero.StringFrom("2"),
		RecordsManagementBucket:               []zero.String{zero.StringFrom("Record 1"), zero.StringFrom("Record 2")},
		RecordsManagementDisposalLocation:     zero.StringFrom("Recycle bin"),
		RecordsManagementDisposalPlan:         zero.StringFrom("Weekly deletion"),
		RecordsUnderLegalHold:                 false,
		SourceCodeOnDemand:                    false,
		SystemCustomization:                   zero.StringFrom("50%% customization"),
		SystemDesignOnDemand:                  false,
		SystemDataLocation:                    []zero.String{zero.StringFrom("Denver, CO")},
		SystemDataLocationNotes:               zero.StringFrom("Notes about Denver"),
		SystemProductionDate:                  zero.TimeFrom(time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)),
		SystemRequirementsOnDemand:            false,
		TestPlanOnDemand:                      false,
		TestReportsOnDemand:                   false,
		TestScriptsOnDemand:                   false,
		YearToRetireReplace:                   zero.StringFrom("2025"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}": {
		AdHocAgileDeploymentFrequency:         zero.StringFrom("Monthly"),
		AgileUsed:                             true,
		AuthoritativeDatasource:               zero.StringFrom("PostgreSQL"),
		BusinessArtifactsOnDemand:             true,
		DataAtRestEncryptionKeyManagement:     zero.StringFrom("Passkey"),
		DeploymentFrequency:                   zero.StringFrom("Every 25 seconds"),
		DevCompletionPercent:                  zero.StringFrom("Less than 1%"),
		DevWorkDescription:                    zero.StringFrom("Trying our best to complete the task"),
		EcapParticipation:                     true,
		FrontendAccessType:                    zero.StringFrom("IPv4 and IPv6"),
		HardCodedIPAddress:                    true,
		IP6EnabledAssetPercent:                zero.StringFrom("100%"),
		IP6TransitionPlan:                     zero.StringFrom("IPv6 transition complete"),
		IPEnabledAssetCount:                   45,
		LegalHoldCaseName:                     zero.StringFrom("Hold name"),
		LocallyStoredUserInformation:          false,
		MajorRefreshDate:                      zero.TimeFrom(time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)),
		MultifactorAuthenticationMethod:       []zero.String{zero.StringFrom("Google Authenticator"), zero.StringFrom("Microsoft Authenticator")},
		MultifactorAuthenticationMethodOther:  zero.StringFrom("Other mfa methods"),
		NetAccessibility:                      zero.StringFrom("Accessible to a CMS-internal network only"),
		NetworkTrafficEncryptionKeyManagement: zero.StringFrom("Passkey"),
		NoMajorRefresh:                        false,
		NoPersistentRecordsFlag:               false,
		NoPlannedMajorRefresh:                 false,
		OmDocumentationOnDemand:               true,
		PlansToRetireReplace:                  zero.StringFrom("Yes - Retire only"),
		QuarterToRetireReplace:                zero.StringFrom("2"),
		RecordsManagementBucket:               []zero.String{zero.StringFrom("Management 1"), zero.StringFrom("Management 2")},
		RecordsManagementDisposalLocation:     zero.StringFrom("Recycle bin"),
		RecordsManagementDisposalPlan:         zero.StringFrom("Weekly deletion"),
		RecordsUnderLegalHold:                 false,
		SourceCodeOnDemand:                    true,
		SystemCustomization:                   zero.StringFrom("More than 25%% customization"),
		SystemDesignOnDemand:                  true,
		SystemDataLocation:                    []zero.String{zero.StringFrom("Detroit, MI")},
		SystemDataLocationNotes:               zero.StringFrom("Notes about Detroit"),
		SystemProductionDate:                  zero.TimeFrom(time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)),
		SystemRequirementsOnDemand:            true,
		TestPlanOnDemand:                      true,
		TestReportsOnDemand:                   true,
		TestScriptsOnDemand:                   true,
		YearToRetireReplace:                   zero.StringFrom("2077"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}": {
		AdHocAgileDeploymentFrequency:         zero.StringFrom("Hourly"),
		AgileUsed:                             false,
		AuthoritativeDatasource:               zero.StringFrom("MongoDB"),
		BusinessArtifactsOnDemand:             false,
		DataAtRestEncryptionKeyManagement:     zero.StringFrom("Keychain"),
		DeploymentFrequency:                   zero.StringFrom("Once"),
		DevCompletionPercent:                  zero.StringFrom("92%"),
		DevWorkDescription:                    zero.StringFrom("Trying to fix an elusive bug"),
		EcapParticipation:                     false,
		FrontendAccessType:                    zero.StringFrom("IPv4 and IPv6"),
		HardCodedIPAddress:                    false,
		IP6EnabledAssetPercent:                zero.StringFrom("More than 90%"),
		IP6TransitionPlan:                     zero.StringFrom("This system will be transitioned to IPv6"),
		IPEnabledAssetCount:                   15,
		LegalHoldCaseName:                     zero.StringFrom("Legal case"),
		LocallyStoredUserInformation:          false,
		MajorRefreshDate:                      zero.TimeFrom(time.Date(2026, 3, 3, 0, 0, 0, 0, time.UTC)),
		MultifactorAuthenticationMethod:       []zero.String{zero.StringFrom("Google Authenticator"), zero.StringFrom("Microsoft Authenticator")},
		MultifactorAuthenticationMethodOther:  zero.StringFrom("Other mfa methods"),
		NetAccessibility:                      zero.StringFrom("Accessible to Oddball employees only"),
		NetworkTrafficEncryptionKeyManagement: zero.StringFrom("Keychain"),
		NoMajorRefresh:                        false,
		NoPersistentRecordsFlag:               false,
		NoPlannedMajorRefresh:                 false,
		OmDocumentationOnDemand:               false,
		PlansToRetireReplace:                  zero.StringFrom("No"),
		QuarterToRetireReplace:                zero.StringFrom("4"),
		RecordsManagementBucket:               []zero.String{zero.StringFrom("Bucket 1"), zero.StringFrom("Record 2")},
		RecordsManagementDisposalLocation:     zero.StringFrom("Recycle bin"),
		RecordsManagementDisposalPlan:         zero.StringFrom("Weekly deletion"),
		RecordsUnderLegalHold:                 false,
		SourceCodeOnDemand:                    false,
		SystemCustomization:                   zero.StringFrom("0%% customization"),
		SystemDesignOnDemand:                  false,
		SystemDataLocation:                    []zero.String{zero.StringFrom("Phoenix, AZ")},
		SystemDataLocationNotes:               zero.StringFrom("Notes about Phoenix"),
		SystemProductionDate:                  zero.TimeFrom(time.Date(2025, 3, 14, 0, 0, 0, 0, time.UTC)),
		SystemRequirementsOnDemand:            false,
		TestPlanOnDemand:                      false,
		TestReportsOnDemand:                   false,
		TestScriptsOnDemand:                   false,
		YearToRetireReplace:                   zero.StringFrom("2034"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC4E}": {
		AdHocAgileDeploymentFrequency:         zero.StringFrom("Annually"),
		AgileUsed:                             true,
		AuthoritativeDatasource:               zero.StringFrom("Google docs"),
		BusinessArtifactsOnDemand:             true,
		DataAtRestEncryptionKeyManagement:     zero.StringFrom("Post-its"),
		DeploymentFrequency:                   zero.StringFrom("Daily"),
		DevCompletionPercent:                  zero.StringFrom("60%"),
		DevWorkDescription:                    zero.StringFrom("Designing frontend and UX"),
		EcapParticipation:                     true,
		FrontendAccessType:                    zero.StringFrom("IPv4 and IPv6"),
		HardCodedIPAddress:                    true,
		IP6EnabledAssetPercent:                zero.StringFrom("50%"),
		IP6TransitionPlan:                     zero.StringFrom("This system will be transitioned to IPv6"),
		IPEnabledAssetCount:                   25,
		LegalHoldCaseName:                     zero.StringFrom("Case name"),
		LocallyStoredUserInformation:          false,
		MajorRefreshDate:                      zero.TimeFrom(time.Date(2028, 1, 2, 0, 0, 0, 0, time.UTC)),
		MultifactorAuthenticationMethod:       []zero.String{zero.StringFrom("Google Authenticator"), zero.StringFrom("Microsoft Authenticator")},
		MultifactorAuthenticationMethodOther:  zero.StringFrom("Other mfa methods"),
		NetAccessibility:                      zero.StringFrom("Accessible to EASi team members only"),
		NetworkTrafficEncryptionKeyManagement: zero.StringFrom("Post-its"),
		NoMajorRefresh:                        false,
		NoPersistentRecordsFlag:               false,
		NoPlannedMajorRefresh:                 false,
		OmDocumentationOnDemand:               true,
		PlansToRetireReplace:                  zero.StringFrom("Yes - Retire and Replace"),
		QuarterToRetireReplace:                zero.StringFrom("3"),
		RecordsManagementBucket:               []zero.String{zero.StringFrom("Management 1"), zero.StringFrom("Bucket 2")},
		RecordsManagementDisposalLocation:     zero.StringFrom("Recycle bin"),
		RecordsManagementDisposalPlan:         zero.StringFrom("Weekly deletion"),
		RecordsUnderLegalHold:                 false,
		SourceCodeOnDemand:                    true,
		SystemCustomization:                   zero.StringFrom("Between 50% and 60%% customization"),
		SystemDesignOnDemand:                  true,
		SystemDataLocation:                    []zero.String{zero.StringFrom("Los Angeles, CA")},
		SystemDataLocationNotes:               zero.StringFrom("Notes about Los Angeles"),
		SystemProductionDate:                  zero.TimeFrom(time.Date(2029, 1, 2, 0, 0, 0, 0, time.UTC)),
		SystemRequirementsOnDemand:            true,
		TestPlanOnDemand:                      true,
		TestReportsOnDemand:                   true,
		TestScriptsOnDemand:                   true,
		YearToRetireReplace:                   zero.StringFrom("2030"),
	},
}

func GetSystemMaintainerInformation(cedarSystemId string) *models.SystemMaintainerInformation {
	if val, ok := mockSystemMaintainerInformation[cedarSystemId]; ok {
		return val
	}

	return &models.SystemMaintainerInformation{}
}
