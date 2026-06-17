package resolvers

import (
	"strconv"
	"strings"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func formatLCIDDisplay(intake *models.SystemIntake) *string {
	if intake == nil || intake.LifecycleID.ValueOrZero() == "" {
		return nil
	}

	parts := []string{intake.LifecycleID.ValueOrZero()}
	if intake.LifecycleIssuedAt != nil {
		parts = append(parts, strconv.Itoa(intake.LifecycleIssuedAt.Year()))
	}

	if componentLabel := formatLCIDDisplayComponent(intake.LCIDComponent); componentLabel != "" {
		parts = append(parts, componentLabel)
	}

	if intake.LCIDType != nil {
		switch *intake.LCIDType {
		case models.LCIDTypeNewSystem:
			parts = append(parts, "NEW_SYSTEM")
		case models.LCIDTypeRecompete:
			parts = append(parts, "RECOMPETE")
		}
	}

	if intake.LCIDIsShortened != nil && *intake.LCIDIsShortened {
		parts = append(parts, "SHORTENED")
	}
	if intake.LCIDIsLowIT != nil && *intake.LCIDIsLowIT {
		parts = append(parts, "LOW_IT")
	}

	display := strings.Join(parts, " - ")
	return &display
}

func formatLCIDDisplayComponent(component *models.SystemIntakeContactComponent) string {
	if component == nil {
		return ""
	}

	switch *component {
	case models.SystemIntakeContactComponentCenterForClinicalStandardsAndQualityCcsq:
		return "CCSQ"
	case models.SystemIntakeContactComponentCenterForConsumerInformationAndInsuranceOversightCciio:
		return "CCIIO"
	case models.SystemIntakeContactComponentCenterForMedicareCm:
		return "CM"
	case models.SystemIntakeContactComponentCenterForMedicaidAndChipServicesCmcs:
		return "CMCS"
	case models.SystemIntakeContactComponentCenterForMedicareAndMedicaidInnovationCmmi:
		return "CMMI"
	case models.SystemIntakeContactComponentCenterForProgramIntegrityCpi:
		return "CPI"
	case models.SystemIntakeContactComponentCmsWide:
		return "CMS"
	case models.SystemIntakeContactComponentEmergencyPreparednessAndResponseOperationsEpro:
		return "EPRO"
	case models.SystemIntakeContactComponentFederalCoordinatedHealthCareOffice:
		return "FCHCO"
	case models.SystemIntakeContactComponentOfficeOfAcquisitionAndGrantsManagementOagm:
		return "OAGM"
	case models.SystemIntakeContactComponentOfficeOfHealthcareExperienceAndInteroperability:
		return "OHEI"
	case models.SystemIntakeContactComponentOfficeOfCommunicationsOc:
		return "OC"
	case models.SystemIntakeContactComponentOfficeOfEnterpriseDataAndAnalyticsOeda:
		return "OEDA"
	case models.SystemIntakeContactComponentOfficeOfEqualOpportunityAndCivilRights:
		return "OEOCR"
	case models.SystemIntakeContactComponentOfficeOfFinancialManagementOfm:
		return "OFM"
	case models.SystemIntakeContactComponentOfficeOfHumanCapital:
		return "OHC"
	case models.SystemIntakeContactComponentOfficeOfInformationTechnologyOit:
		return "OIT"
	case models.SystemIntakeContactComponentOfficeOfLegislation:
		return "OL"
	case models.SystemIntakeContactComponentOfficeOfMinorityHealthOmh:
		return "OMH"
	case models.SystemIntakeContactComponentOfficeOfProgramOperationsAndLocalEngagementOpole:
		return "OPOLE"
	case models.SystemIntakeContactComponentOfficeOfSecurityFacilitiesAndLogisticsOperationsOsflo:
		return "OSFLO"
	case models.SystemIntakeContactComponentOfficeOfStrategicOperationsAndRegulatoryAffairsOsora:
		return "OSORA"
	case models.SystemIntakeContactComponentOfficeOfStrategyPerformanceAndResultsOspr:
		return "OSPR"
	case models.SystemIntakeContactComponentOfficeOfTheActuaryOact:
		return "OACT"
	case models.SystemIntakeContactComponentOfficeOfTheAdministrator:
		return "OA"
	case models.SystemIntakeContactComponentOfficesOfHearingsAndInquiries:
		return "OHI"
	case models.SystemIntakeContactComponentOther:
		return "OTHER"
	default:
		return ""
	}
}
