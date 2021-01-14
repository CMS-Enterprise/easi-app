import {
  A11YADMIN_DEV,
  A11YADMIN_PROD,
  A11YTESTER_DEV,
  A11YTESTER_PROD,
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

export const isA11yTester = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes(A11YTESTER_DEV) || groups.includes(A11YTESTER_PROD))
  ) {
    return true;
  }

  return false;
};

export const isA11yAdmin = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes(A11YADMIN_DEV) || groups.includes(A11YADMIN_PROD))
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
  isA11yTester,
  isA11yAdmin,
  isBasicUser
};

export default user;
