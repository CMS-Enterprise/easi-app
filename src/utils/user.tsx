export const isGrtReviewer = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes('EASI_D_GOVTEAM') || groups.includes('EASI_P_GOVTEAM'))
  ) {
    return true;
  }

  return false;
};

export const is508Tester = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes('EASI_D_508TESTER') || groups.includes('EASI_P_508TESTER'))
  ) {
    return true;
  }

  return false;
};

export const is508Admin = (groups: Array<String> | null) => {
  if (
    groups &&
    (groups.includes('EASI_D_508ADMIN') || groups.includes('EASI_P_508ADMIN'))
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
