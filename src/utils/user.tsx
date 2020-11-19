export const isGrtReviewer = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes('EASI_D_GOVTEAM') || groups.includes('EASI_P_GOVTEAM'))
  ) {
    return true;
  }

  return true;
};

const user = {
  isGrtReviewer
};

export default user;
