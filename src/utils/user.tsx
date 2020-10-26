export const isGrtReviewer = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes('EASI_D_GOVTEAM') || groups.includes('EASI_P_GOVTEAM'))
  ) {
    return true;
  }

  return false;
};

export default {
  isGrtReviewer
};
