export const BASIC_USER_PROD = 'EASI_P_USER';
export const GOVTEAM_DEV = 'EASI_D_GOVTEAM';
export const GOVTEAM_PROD = 'EASI_P_GOVTEAM';
export const TRB_ADMIN_DEV = 'EASI_TRB_ADMIN_D';
export const TRB_ADMIN_PROD = 'EASI_TRB_ADMIN_P';

export const JOB_CODES = [
  BASIC_USER_PROD,
  GOVTEAM_DEV,
  GOVTEAM_PROD,
  TRB_ADMIN_DEV,
  TRB_ADMIN_PROD
] as const;

export type JobCode = (typeof JOB_CODES)[number];

export default JOB_CODES;
