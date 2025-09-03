// *******
// NOTE - when updating this list, please update the corresponding map in `pkg/email/translation/constants.go`
// *******
const cmsDivisionsAndOffices = [
  {
    acronym: '',
    name: "Consortium For Medicaid And Children's Health",
    enum: 'CONSORTIUM_FOR_MEDICAID_AND_CHILDRENS_HEALTH',
    legacy: true
  },
  {
    acronym: '',
    name: 'Consortium For Medicare Health Plans Operations',
    enum: 'CONSORTIUM_FOR_MEDICARE_HEALTH_PLANS_OPERATIONS',
    legacy: true
  },
  {
    acronym: '',
    name: 'Office Of Burden Reduction And Health Informatics',
    enum: 'OFFICE_OF_BURDEN_REDUCTION_AND_HEALTH_INFORMATICS',
    legacy: true
  },
  {
    acronym: '',
    name: 'Office Of Support Services And Operations',
    enum: 'OFFICE_OF_SUPPORT_SERVICES_AND_OPERATIONS',
    legacy: true
  },
  {
    acronym: 'CCSQ',
    name: 'Center for Clinical Standards and Quality',
    enum: 'CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ',
    legacy: false
  },
  {
    acronym: 'CCIIO',
    name: 'Center for Consumer Information and Insurance Oversight',
    enum: 'CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO',
    legacy: false
  },
  {
    acronym: 'CM',
    name: 'Center for Medicare',
    enum: 'CENTER_FOR_MEDICARE_CM',
    legacy: false
  },
  {
    acronym: 'CMCS',
    name: 'Center for Medicaid and CHIP Services',
    enum: 'CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS',
    legacy: false
  },
  {
    acronym: 'CMMI',
    name: 'Center for Medicare and Medicaid Innovation',
    enum: 'CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI',
    legacy: false
  },
  {
    acronym: 'CPI',
    name: 'Center for Program Integrity',
    enum: 'CENTER_FOR_PROGRAM_INTEGRITY_CPI',
    legacy: false
  },
  {
    acronym: 'CMS',
    name: 'CMS Wide',
    enum: 'CMS_WIDE',
    legacy: false
  },
  {
    acronym: 'EPRO',
    name: 'Emergency Preparedness and Response Operations',
    enum: 'EMERGENCY_PREPAREDNESS_AND_RESPONSE_OPERATIONS_EPRO',
    legacy: false
  },
  {
    acronym: 'FCHCO',
    name: 'Federal Coordinated Health Care Office',
    enum: 'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE',
    legacy: false
  },
  {
    acronym: 'OAGM',
    name: 'Office of Acquisition and Grants Management',
    enum: 'OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM',
    legacy: false
  },
  {
    acronym: 'OHEI',
    name: 'Office of Healthcare Experience and Interoperability',
    enum: 'OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY',
    legacy: false
  },
  {
    acronym: 'OC',
    name: 'Office of Communications',
    enum: 'OFFICE_OF_COMMUNICATIONS_OC',
    legacy: false
  },
  {
    acronym: 'OEDA',
    name: 'Office of Enterprise Data and Analytics',
    enum: 'OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA',
    legacy: false
  },
  {
    acronym: 'OEOCR',
    name: 'Office of Equal Opportunity and Civil Rights',
    enum: 'OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS',
    legacy: false
  },
  {
    acronym: 'OFM',
    name: 'Office of Financial Management',
    enum: 'OFFICE_OF_FINANCIAL_MANAGEMENT_OFM',
    legacy: false
  },
  {
    acronym: 'OHC',
    name: 'Office of Human Capital',
    enum: 'OFFICE_OF_HUMAN_CAPITAL',
    legacy: false
  },
  {
    acronym: 'OIT',
    name: 'Office of Information Technology',
    enum: 'OFFICE_OF_INFORMATION_TECHNOLOGY_OIT',
    legacy: false
  },
  {
    acronym: 'OL',
    name: 'Office of Legislation',
    enum: 'OFFICE_OF_LEGISLATION',
    legacy: false
  },
  {
    acronym: 'OMH',
    name: 'Office of Minority Health',
    enum: 'OFFICE_OF_MINORITY_HEALTH_OMH',
    legacy: false
  },
  {
    acronym: 'OPOLE',
    name: 'Office of Program Operations and Local Engagement',
    enum: 'OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE',
    legacy: false
  },
  {
    acronym: 'OSFLO',
    name: 'Office of Security, Facilities, and Logistics Operations',
    enum: 'OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO',
    legacy: false
  },
  {
    acronym: 'OSORA',
    name: 'Office of Strategic Operations and Regulatory Affairs',
    enum: 'OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA',
    legacy: false
  },
  {
    acronym: 'OSPR',
    name: 'Office of Strategy, Performance, and Results',
    enum: 'OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR',
    legacy: false
  },
  {
    acronym: 'OA', // This should be OACT
    name: 'Office of the Actuary',
    enum: 'OFFICE_OF_THE_ACTUARY_OACT',
    legacy: false
  },
  {
    acronym: 'OA', // Note this currently duplicates OACT
    name: 'Office of the Administrator',
    enum: 'OFFICE_OF_THE_ADMINISTRATOR',
    legacy: false
  },
  {
    acronym: 'OHI',
    name: 'Offices of Hearings and Inquiries',
    enum: 'OFFICES_OF_HEARINGS_AND_INQUIRIES',
    legacy: false
  },
  {
    acronym: '',
    name: 'Other',
    enum: 'OTHER',
    legacy: false
  }
] as const;

export type CMSOfficeAcronym =
  (typeof cmsDivisionsAndOffices)[number]['acronym'];
export type CMSOffice = (typeof cmsDivisionsAndOffices)[number]['name'];

export default cmsDivisionsAndOffices;
