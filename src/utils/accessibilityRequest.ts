import i18next from 'i18next';

import { AccessibilityRequestDocumentCommonType } from 'types/graphql-global-types';

/**
 * Translate the API enum to a human readable string
 */
// eslint-disable-next-line import/prefer-default-export
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
