import i18next from 'i18next';

import {
  AccessibilityRequestDocumentCommonType,
  TestDateTestType
} from 'types/graphql-global-types';

/**
 * Translate the document type API enum to a human readable string
 */
export const translateDocumentType = (
  commonDocumentType: AccessibilityRequestDocumentCommonType
) => {
  switch (commonDocumentType) {
    case 'AWARDED_VPAT':
      return i18next.t('accessibility:documentType.awardedVpat');
    case 'REMEDIATION_PLAN':
      return i18next.t('accessibility:documentType.remediationPlan');
    case 'TEST_PLAN':
      return i18next.t('accessibility:documentType.testPlan');
    case 'TEST_RESULTS':
      return i18next.t('accessibility:documentType.testResults');
    case 'TESTING_VPAT':
      return i18next.t('accessibility:documentType.testingVpat');
    case 'OTHER':
      return i18next.t('accessibility:documentType.other');
    default:
      return '';
  }
};

/**
 * Translate the test date type API enum to a human readable string
 */
export const translateTestType = (testType: TestDateTestType) => {
  switch (testType) {
    case 'INITIAL':
      return i18next.t('accessibility:testDateForm.inital');
    case 'REMEDIATION':
      return i18next.t('accessibility:testDateForm.remediation');
    default:
      return '';
  }
};
