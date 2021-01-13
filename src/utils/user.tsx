import {
  FIVE08ADMIN_DEV,
  FIVE08ADMIN_PROD,
  FIVE08TESTER_DEV,
  FIVE08TESTER_PROD,
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

export const is508Tester = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes(FIVE08TESTER_DEV) || groups.includes(FIVE08TESTER_PROD))
  ) {
    return true;
  }

  return false;
};

export const is508Admin = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes(FIVE08ADMIN_DEV) || groups.includes(FIVE08ADMIN_PROD))
  ) {
    return true;
  }

  return false;
};

const user = {
  isGrtReviewer,
  is508Tester,
  is508Admin
};

export default user;
