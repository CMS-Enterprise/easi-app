import { closedIntakeStatuses, openIntakeStatuses } from 'types/systemIntake';
/**
 * Checks whenther an intake is closed
 * @param status - the intake's status
 */
export const isIntakeClosed = (status: string) => {
  return closedIntakeStatuses.includes(status);
};

/**
 * Checks whenther an intake is open
 * @param status - the intake's status
 */
export const isIntakeOpen = (status: string) => {
  return openIntakeStatuses.includes(status);
};
