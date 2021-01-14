import {
  ACCESSIBILITY_ADMIN_DEV,
  ACCESSIBILITY_ADMIN_PROD,
  ACCESSIBILITY_TESTER_DEV,
  ACCESSIBILITY_TESTER_PROD,
  GOVTEAM_DEV,
  GOVTEAM_PROD
} from 'constants/jobCodes';

export const isGrtReviewer = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes(GOVTEAM_DEV) || groups.includes(GOVTEAM_PROD))
  ) {
    return true;
  }

  return false;
};

export const isAccessibilityTester = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes(ACCESSIBILITY_TESTER_DEV) ||
      groups.includes(ACCESSIBILITY_TESTER_PROD))
  ) {
    return true;
  }

  return false;
};

export const isAccessibilityAdmin = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes(ACCESSIBILITY_ADMIN_DEV) ||
      groups.includes(ACCESSIBILITY_ADMIN_PROD))
  ) {
    return true;
  }

  return false;
};

export const isBasicUser = (groups: Array<String> | null) => {
  return groups && groups.length === 0;
};

const user = {
  isGrtReviewer,
  isAccessabilityTester,
  isAccessabilityAdmin,
  isBasicUser
};

export default user;
