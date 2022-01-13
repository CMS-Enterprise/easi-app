export type IconStatus = 'success' | 'warning' | 'fail'; // TODO - Need more types for IconStatus in response to CEDAR SystemHealthIcon mappings.

export type CedarStatus = string | null; // Need to extract all possible returns for this field from CEDAR ex: Approved, Draft, etc.

// TODO - if we want to keep this text past the prototype state, it needs to use translation
export const mapCedarStatusToIcon = (status: CedarStatus): IconStatus => {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Draft':
      return 'warning';
    default:
      return 'fail';
  }
};

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
