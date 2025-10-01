import { SystemIntakeContactComponent } from 'gql/generated/graphql';

/** Map of CMS components to their label key and acronym */
const cmsComponentsMap: Record<
  SystemIntakeContactComponent,
  {
    /** If true, component is only found in legacy data and cannot be selected in the UI */
    readonly legacy: boolean;
    readonly labelKey: string;
    readonly acronym?: string;
  }
> = {
  CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ: {
    acronym: 'CCSQ',
    labelKey:
      'intake:systemIntakeContactComponents.CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ',
    legacy: false
  },
  CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO: {
    acronym: 'CCIIO',
    labelKey:
      'intake:systemIntakeContactComponents.CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO',
    legacy: false
  },
  CENTER_FOR_MEDICARE_CM: {
    acronym: 'CM',
    labelKey: 'intake:systemIntakeContactComponents.CENTER_FOR_MEDICARE_CM',
    legacy: false
  },
  CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS: {
    acronym: 'CMCS',
    labelKey:
      'intake:systemIntakeContactComponents.CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS',
    legacy: false
  },
  CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI: {
    acronym: 'CMMI',
    labelKey:
      'intake:systemIntakeContactComponents.CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI',
    legacy: false
  },
  CENTER_FOR_PROGRAM_INTEGRITY_CPI: {
    acronym: 'CPI',
    labelKey:
      'intake:systemIntakeContactComponents.CENTER_FOR_PROGRAM_INTEGRITY_CPI',
    legacy: false
  },
  CMS_WIDE: {
    acronym: 'CMS',
    labelKey: 'intake:systemIntakeContactComponents.CMS_WIDE',
    legacy: false
  },
  EMERGENCY_PREPAREDNESS_AND_RESPONSE_OPERATIONS_EPRO: {
    acronym: 'EPRO',
    labelKey:
      'intake:systemIntakeContactComponents.EMERGENCY_PREPAREDNESS_AND_RESPONSE_OPERATIONS_EPRO',
    legacy: false
  },
  FEDERAL_COORDINATED_HEALTH_CARE_OFFICE: {
    acronym: 'FCHCO',
    labelKey:
      'intake:systemIntakeContactComponents.FEDERAL_COORDINATED_HEALTH_CARE_OFFICE',
    legacy: false
  },
  OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM: {
    acronym: 'OAGM',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM',
    legacy: false
  },
  OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY: {
    acronym: 'OHEI',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY',
    legacy: false
  },
  OFFICE_OF_COMMUNICATIONS_OC: {
    acronym: 'OC',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_COMMUNICATIONS_OC',
    legacy: false
  },
  OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA: {
    acronym: 'OEDA',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA',
    legacy: false
  },
  OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS: {
    acronym: 'OEOCR',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS',
    legacy: false
  },
  OFFICE_OF_FINANCIAL_MANAGEMENT_OFM: {
    acronym: 'OFM',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_FINANCIAL_MANAGEMENT_OFM',
    legacy: false
  },
  OFFICE_OF_HUMAN_CAPITAL: {
    acronym: 'OHC',
    labelKey: 'intake:systemIntakeContactComponents.OFFICE_OF_HUMAN_CAPITAL',
    legacy: false
  },
  OFFICE_OF_INFORMATION_TECHNOLOGY_OIT: {
    acronym: 'OIT',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_INFORMATION_TECHNOLOGY_OIT',
    legacy: false
  },
  OFFICE_OF_LEGISLATION: {
    acronym: 'OL',
    labelKey: 'intake:systemIntakeContactComponents.OFFICE_OF_LEGISLATION',
    legacy: false
  },
  OFFICE_OF_MINORITY_HEALTH_OMH: {
    acronym: 'OMH',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_MINORITY_HEALTH_OMH',
    legacy: false
  },
  OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE: {
    acronym: 'OPOLE',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE',
    legacy: false
  },
  OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO: {
    acronym: 'OSFLO',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO',
    legacy: false
  },
  OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA: {
    acronym: 'OSORA',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA',
    legacy: false
  },
  OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR: {
    acronym: 'OSPR',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR',
    legacy: false
  },
  OFFICE_OF_THE_ACTUARY_OACT: {
    acronym: 'OACT',
    labelKey: 'intake:systemIntakeContactComponents.OFFICE_OF_THE_ACTUARY_OACT',
    legacy: false
  },
  OFFICES_OF_HEARINGS_AND_INQUIRIES: {
    acronym: 'OHI',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICES_OF_HEARINGS_AND_INQUIRIES',
    legacy: false
  },
  OFFICE_OF_THE_ADMINISTRATOR: {
    acronym: 'OA',
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_THE_ADMINISTRATOR',
    legacy: false
  },
  CONSORTIUM_FOR_MEDICAID_AND_CHILDRENS_HEALTH: {
    labelKey:
      'intake:systemIntakeContactComponents.CONSORTIUM_FOR_MEDICAID_AND_CHILDRENS_HEALTH',
    legacy: true
  },
  CONSORTIUM_FOR_MEDICARE_HEALTH_PLANS_OPERATIONS: {
    labelKey:
      'intake:systemIntakeContactComponents.CONSORTIUM_FOR_MEDICARE_HEALTH_PLANS_OPERATIONS',
    legacy: true
  },
  OFFICE_OF_BURDEN_REDUCTION_AND_HEALTH_INFORMATICS: {
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_BURDEN_REDUCTION_AND_HEALTH_INFORMATICS',
    legacy: true
  },
  OFFICE_OF_SUPPORT_SERVICES_AND_OPERATIONS: {
    labelKey:
      'intake:systemIntakeContactComponents.OFFICE_OF_SUPPORT_SERVICES_AND_OPERATIONS',
    legacy: true
  },
  OTHER: {
    labelKey: 'intake:systemIntakeContactComponents.OTHER',
    legacy: false
  }
};

export default cmsComponentsMap;
