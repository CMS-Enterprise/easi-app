export type IconStatus = 'success' | 'warning' | 'fail';

const mapStatusToRanking = (status: IconStatus): number => {
  switch (status) {
    case 'success':
      return 0;
    case 'warning':
      return 1;
    case 'fail':
      return 2;
    default:
      return Number.MAX_SAFE_INTEGER;
  }
};

export const sortByStatus = (
  statusA: IconStatus,
  statusB: IconStatus
): number => {
  return mapStatusToRanking(statusA) - mapStatusToRanking(statusB);
};
