import {
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

  return groups.includes(TRB_ADMIN_DEV) || groups.includes(TRB_ADMIN_PROD);
};

export const isITGovAdmin = (groups: Array<String> = [], flags: Flags) => {
  if (flags.downgradeGovTeam) {
    return false;
  }

  return groups.includes(GOVTEAM_DEV) || groups.includes(GOVTEAM_PROD);
};

export const isBasicUser = (groups: Array<String> = [], flags: Flags) => {
  if (groups.includes(BASIC_USER_PROD)) {
    return true;
  }

  if (groups.length === 0) {
    return true;
  }

  return !isITGovAdmin(groups, flags) && !isTrbAdmin(groups, flags);
};

const user = {
  isTrbAdmin,
  isITGovAdmin,
  isBasicUser
};

export default user;
