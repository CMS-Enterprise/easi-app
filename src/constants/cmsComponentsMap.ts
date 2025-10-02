import { SystemIntakeContactComponent } from 'gql/generated/graphql';
import i18next from 'i18next';

interface ComponentMapValues {
  /** If true, component is only found in legacy data and cannot be selected in the UI */
  readonly legacy: boolean;
  readonly labelKey: string;
  readonly acronym?: string;
}

/** Map of CMS components to their label key and acronym */
const cmsComponentsMap: Record<
  SystemIntakeContactComponent,
  ComponentMapValues
> = {
  CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ: {
    acronym: 'CCSQ',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ',
    legacy: false
  },
  CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO: {
    acronym: 'CCIIO',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO',
    legacy: false
  },
  CENTER_FOR_MEDICARE_CM: {
    acronym: 'CM',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.CENTER_FOR_MEDICARE_CM',
    legacy: false
  },
  CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS: {
    acronym: 'CMCS',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS',
    legacy: false
  },
  CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI: {
    acronym: 'CMMI',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI',
    legacy: false
  },
  CENTER_FOR_PROGRAM_INTEGRITY_CPI: {
    acronym: 'CPI',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.CENTER_FOR_PROGRAM_INTEGRITY_CPI',
    legacy: false
  },
  CMS_WIDE: {
    acronym: 'CMS',
    labelKey: 'intake:contactDetails.systemIntakeContactComponents.CMS_WIDE',
    legacy: false
  },
  EMERGENCY_PREPAREDNESS_AND_RESPONSE_OPERATIONS_EPRO: {
    acronym: 'EPRO',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.EMERGENCY_PREPAREDNESS_AND_RESPONSE_OPERATIONS_EPRO',
    legacy: false
  },
  FEDERAL_COORDINATED_HEALTH_CARE_OFFICE: {
    acronym: 'FCHCO',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.FEDERAL_COORDINATED_HEALTH_CARE_OFFICE',
    legacy: false
  },
  OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM: {
    acronym: 'OAGM',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM',
    legacy: false
  },
  OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY: {
    acronym: 'OHEI',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY',
    legacy: false
  },
  OFFICE_OF_COMMUNICATIONS_OC: {
    acronym: 'OC',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_COMMUNICATIONS_OC',
    legacy: false
  },
  OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA: {
    acronym: 'OEDA',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA',
    legacy: false
  },
  OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS: {
    acronym: 'OEOCR',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS',
    legacy: false
  },
  OFFICE_OF_FINANCIAL_MANAGEMENT_OFM: {
    acronym: 'OFM',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_FINANCIAL_MANAGEMENT_OFM',
    legacy: false
  },
  OFFICE_OF_HUMAN_CAPITAL: {
    acronym: 'OHC',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_HUMAN_CAPITAL',
    legacy: false
  },
  OFFICE_OF_INFORMATION_TECHNOLOGY_OIT: {
    acronym: 'OIT',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_INFORMATION_TECHNOLOGY_OIT',
    legacy: false
  },
  OFFICE_OF_LEGISLATION: {
    acronym: 'OL',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_LEGISLATION',
    legacy: false
  },
  OFFICE_OF_MINORITY_HEALTH_OMH: {
    acronym: 'OMH',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_MINORITY_HEALTH_OMH',
    legacy: false
  },
  OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE: {
    acronym: 'OPOLE',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE',
    legacy: false
  },
  OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO: {
    acronym: 'OSFLO',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO',
    legacy: false
  },
  OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA: {
    acronym: 'OSORA',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA',
    legacy: false
  },
  OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR: {
    acronym: 'OSPR',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR',
    legacy: false
  },
  OFFICE_OF_THE_ACTUARY_OACT: {
    acronym: 'OACT',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_THE_ACTUARY_OACT',
    legacy: false
  },
  OFFICE_OF_THE_ADMINISTRATOR: {
    acronym: 'OA',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_THE_ADMINISTRATOR',
    legacy: false
  },
  OFFICES_OF_HEARINGS_AND_INQUIRIES: {
    acronym: 'OHI',
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICES_OF_HEARINGS_AND_INQUIRIES',
    legacy: false
  },
  CONSORTIUM_FOR_MEDICAID_AND_CHILDRENS_HEALTH: {
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.CONSORTIUM_FOR_MEDICAID_AND_CHILDRENS_HEALTH',
    legacy: true
  },
  CONSORTIUM_FOR_MEDICARE_HEALTH_PLANS_OPERATIONS: {
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.CONSORTIUM_FOR_MEDICARE_HEALTH_PLANS_OPERATIONS',
    legacy: true
  },
  OFFICE_OF_BURDEN_REDUCTION_AND_HEALTH_INFORMATICS: {
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_BURDEN_REDUCTION_AND_HEALTH_INFORMATICS',
    legacy: true
  },
  OFFICE_OF_SUPPORT_SERVICES_AND_OPERATIONS: {
    labelKey:
      'intake:contactDetails.systemIntakeContactComponents.OFFICE_OF_SUPPORT_SERVICES_AND_OPERATIONS',
    legacy: true
  },
  OTHER: {
    labelKey: 'intake:contactDetails.systemIntakeContactComponents.OTHER',
    legacy: false
  }
};

// Type for component data
export interface ComponentData extends ComponentMapValues {
  readonly enum: SystemIntakeContactComponent;
}

/** Get component data by enum value */
export const getComponentByEnum = (
  component: SystemIntakeContactComponent
): ComponentData => ({
  ...cmsComponentsMap[component],
  enum: component
});

/** Get component data by translated name */
export const getComponentByName = (name: string): ComponentData | undefined => {
  const component = Object.entries(cmsComponentsMap).find(
    ([, value]) => i18next.t(value.labelKey) === name
  );

  if (!component) return undefined;

  const [key, data] = component;

  return {
    ...data,
    enum: key as SystemIntakeContactComponent
  };
};

interface NonLegacyComponentData extends ComponentData {
  readonly legacy: false;
}

/**
 * Get all non-legacy components as an array
 *
 * Useful when iterating over components for select field options
 */
export const getNonLegacyComponents = (): Array<NonLegacyComponentData> => {
  return Object.entries(cmsComponentsMap)
    .filter(([, value]) => !value.legacy)
    .map(([key, value]) => ({
      ...value,
      legacy: false,
      enum: key as SystemIntakeContactComponent
    }));
};
