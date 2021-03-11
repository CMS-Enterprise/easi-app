import {
  ACCESSIBILITY_ADMIN_DEV,
  ACCESSIBILITY_ADMIN_PROD,
  ACCESSIBILITY_TESTER_DEV,
  ACCESSIBILITY_TESTER_PROD,
  BASIC_USER_PROD,
  GOVTEAM_DEV,
  GOVTEAM_PROD
} from 'constants/jobCodes';

export const isGrtReviewer = (groups: Array<String> = []) => {
  if (groups.includes(GOVTEAM_DEV) || groups.includes(GOVTEAM_PROD)) {
    return true;
  }

  return false;
};

export const isAccessibilityTester = (groups: Array<String> = []) => {
  if (
    groups.includes(ACCESSIBILITY_TESTER_DEV) ||
    groups.includes(ACCESSIBILITY_TESTER_PROD)
  ) {
    return true;
  }

  return false;
};

export const isAccessibilityAdmin = (groups: Array<String> = []) => {
  if (
    groups.includes(ACCESSIBILITY_ADMIN_DEV) ||
    groups.includes(ACCESSIBILITY_ADMIN_PROD)
  ) {
    return true;
  }

  return false;
};

export const isAccessibilityTeam = (groups: Array<String> = []) => {
  return isAccessibilityAdmin(groups) || isAccessibilityTester(groups);
};

export const isBasicUser = (groups: Array<String> = []) => {
  return groups.includes(BASIC_USER_PROD) || groups.length === 0;
};

const user = {
  isGrtReviewer,
  isAccessibilityTester,
  isAccessibilityAdmin,
  isAccessibilityTeam,
  isBasicUser
};

export default user;
