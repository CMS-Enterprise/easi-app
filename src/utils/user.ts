import {
  ACCESSIBILITY_ADMIN_DEV,
  ACCESSIBILITY_ADMIN_PROD,
  ACCESSIBILITY_TESTER_DEV,
  ACCESSIBILITY_TESTER_PROD,
  BASIC_USER_PROD,
  GOVTEAM_DEV,
  GOVTEAM_PROD,
  TRB_ADMIN_DEV,
  TRB_ADMIN_PROD
} from 'constants/jobCodes';
import { Flags } from 'types/flags';

export const isTrbAdmin = (groups: Array<String> = [], flags: Flags) => {
  if (flags.downgradeTrbAdmin) {
    return false;
  }

  if (groups.includes(TRB_ADMIN_DEV) || groups.includes(TRB_ADMIN_PROD)) {
    return true;
  }

  return false;
};

export const isGrtReviewer = (groups: Array<String> = [], flags: Flags) => {
  if (flags.downgradeGovTeam) {
    return false;
  }

  if (groups.includes(GOVTEAM_DEV) || groups.includes(GOVTEAM_PROD)) {
    return true;
  }

  return false;
};

export const isAccessibilityTester = (
  groups: Array<String> = [],
  flags: Flags
) => {
  if (flags.downgrade508Tester) {
    return false;
  }

  if (
    groups.includes(ACCESSIBILITY_TESTER_DEV) ||
    groups.includes(ACCESSIBILITY_TESTER_PROD)
  ) {
    return true;
  }

  return false;
};

export const isAccessibilityAdmin = (
  groups: Array<String> = [],
  flags: Flags
) => {
  if (flags.downgrade508User) {
    return false;
  }

  if (
    groups.includes(ACCESSIBILITY_ADMIN_DEV) ||
    groups.includes(ACCESSIBILITY_ADMIN_PROD)
  ) {
    return true;
  }

  return false;
};

export const isAccessibilityTeam = (
  groups: Array<String> = [],
  flags: Flags
) => {
  return (
    isAccessibilityAdmin(groups, flags) || isAccessibilityTester(groups, flags)
  );
};

export const isBasicUser = (groups: Array<String> = [], flags: Flags) => {
  if (groups.includes(BASIC_USER_PROD)) {
    return true;
  }
  if (groups.length === 0) {
    return true;
  }
  if (
    !isAccessibilityTeam(groups, flags) &&
    !isGrtReviewer(groups, flags) &&
    !isTrbAdmin(groups, flags)
  ) {
    return true;
  }
  return false;
};

const user = {
  isTrbAdmin,
  isGrtReviewer,
  isAccessibilityTester,
  isAccessibilityAdmin,
  isAccessibilityTeam,
  isBasicUser
};

export default user;
