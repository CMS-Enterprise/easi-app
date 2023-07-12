/* eslint-disable camelcase */
import { GetGovernanceTaskList_systemIntake } from 'queries/types/GetGovernanceTaskList';

export type { GetGovernanceTaskList_systemIntake_itGovTaskStatuses as ItGovTaskStatuses } from 'queries/types/GetGovernanceTaskList';
export type { GetGovernanceTaskList_systemIntake as ItGovTaskSystemIntake } from 'queries/types/GetGovernanceTaskList';
/* eslint-enable camelcase */

// Mock properties for frontend previews
// Get rid of this once backend has completed serving the props
export interface ItGovTaskSystemIntakeWithMockData
  // eslint-disable-next-line camelcase
  extends GetGovernanceTaskList_systemIntake {
  governanceRequestFeedbackCompletedAt?: string | null;
}

export interface GetGovernanceTaskListWithMockData {
  systemIntake: ItGovTaskSystemIntakeWithMockData;
}
