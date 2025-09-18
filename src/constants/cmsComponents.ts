import { SystemIntakeContactComponent } from 'gql/generated/graphql';

type ComponentsMap = Record<
  SystemIntakeContactComponent,
  {
    /** If true, component is only found in legacy data and cannot be selected in the UI */
    legacy: boolean;
    name: string;
    acronym?: string;
  }
>;

/** Map of CMS components to their name and acronym */
const cmsComponents: ComponentsMap = {
  CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ: {
    acronym: 'CCSQ',
    name: 'Center for Clinical Standards and Quality',
    legacy: false
  },
  CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO: {
    acronym: 'CCIIO',
    name: 'Center for Consumer Information and Insurance Oversight',
    legacy: false
  },
  CENTER_FOR_MEDICARE_CM: {
    acronym: 'CM',
    name: 'Center for Medicare',
    legacy: false
  },
  CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS: {
    acronym: 'CMCS',
    name: 'Center for Medicaid and CHIP Services',
    legacy: false
  },
  CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI: {
    acronym: 'CMMI',
    name: 'Center for Medicare and Medicaid Innovation',
    legacy: false
  },
  CENTER_FOR_PROGRAM_INTEGRITY_CPI: {
    acronym: 'CPI',
    name: 'Center for Program Integrity',
    legacy: false
  },
  CMS_WIDE: { acronym: 'CMS', name: 'CMS Wide', legacy: false },
  EMERGENCY_PREPAREDNESS_AND_RESPONSE_OPERATIONS_EPRO: {
    acronym: 'EPRO',
    name: 'Emergency Preparedness and Response Operations',
    legacy: false
  },
  FEDERAL_COORDINATED_HEALTH_CARE_OFFICE: {
    acronym: 'FCHCO',
    name: 'Federal Coordinated Health Care Office',
    legacy: false
  },
  OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM: {
    acronym: 'OAGM',
    name: 'Office of Acquisition and Grants Management',
    legacy: false
  },
  OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY: {
    acronym: 'OHEI',
    name: 'Office of Healthcare Experience and Interoperability',
    legacy: false
  },
  OFFICE_OF_COMMUNICATIONS_OC: {
    acronym: 'OC',
    name: 'Office of Communications',
    legacy: false
  },
  OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA: {
    acronym: 'OEDA',
    name: 'Office of Enterprise Data and Analytics',
    legacy: false
  },
  OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS: {
    acronym: 'OEOCR',
    name: 'Office of Equal Opportunity and Civil Rights',
    legacy: false
  },
  OFFICE_OF_FINANCIAL_MANAGEMENT_OFM: {
    acronym: 'OFM',
    name: 'Office of Financial Management',
    legacy: false
  },
  OFFICE_OF_HUMAN_CAPITAL: {
    acronym: 'OHC',
    name: 'Office of Human Capital',
    legacy: false
  },
  OFFICE_OF_INFORMATION_TECHNOLOGY_OIT: {
    acronym: 'OIT',
    name: 'Office of Information Technology',
    legacy: false
  },
  OFFICE_OF_LEGISLATION: {
    acronym: 'OL',
    name: 'Office of Legislation',
    legacy: false
  },
  OFFICE_OF_MINORITY_HEALTH_OMH: {
    acronym: 'OMH',
    name: 'Office of Minority Health',
    legacy: false
  },
  OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE: {
    acronym: 'OPOLE',
    name: 'Office of Program Operations and Local Engagement',
    legacy: false
  },
  OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO: {
    acronym: 'OSFLO',
    name: 'Office of Security, Facilities, and Logistics Operations',
    legacy: false
  },
  OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA: {
    acronym: 'OSORA',
    name: 'Office of Strategic Operations and Regulatory Affairs',
    legacy: false
  },
  OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR: {
    acronym: 'OSPR',
    name: 'Office of Strategy, Performance, and Results',
    legacy: false
  },
  OFFICE_OF_THE_ACTUARY_OACT: {
    acronym: 'OACT',
    name: 'Office of the Actuary',
    legacy: false
  },
  OFFICES_OF_HEARINGS_AND_INQUIRIES: {
    acronym: 'OHI',
    name: 'Offices of Hearings and Inquiries',
    legacy: false
  },
  OFFICE_OF_THE_ADMINISTRATOR: {
    acronym: 'OA',
    name: 'Office Of The Administrator',
    legacy: false
  },
  CONSORTIUM_FOR_MEDICAID_AND_CHILDRENS_HEALTH: {
    name: "Consortium For Medicaid And Children's Health",
    legacy: true
  },
  CONSORTIUM_FOR_MEDICARE_HEALTH_PLANS_OPERATIONS: {
    name: 'Consortium For Medicare Health Plans Operations',
    legacy: true
  },
  OFFICE_OF_BURDEN_REDUCTION_AND_HEALTH_INFORMATICS: {
    name: 'Office Of Burden Reduction And Health Informatics',
    legacy: true
  },
  OFFICE_OF_SUPPORT_SERVICES_AND_OPERATIONS: {
    name: 'Office Of Support Services And Operations',
    legacy: true
  },
  OTHER: { name: 'Other', legacy: false }
};

export default cmsComponents;
