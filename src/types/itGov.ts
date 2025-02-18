/* eslint-disable camelcase */
import { GetGovernanceTaskList_systemIntake } from 'gql/legacyGQL/types/GetGovernanceTaskList';

export type { GetGovernanceTaskList_systemIntake_itGovTaskStatuses as ItGovTaskStatuses } from 'gql/legacyGQL/types/GetGovernanceTaskList';
export type { GetGovernanceTaskList_systemIntake as ItGovTaskSystemIntake } from 'gql/legacyGQL/types/GetGovernanceTaskList';
/* eslint-enable camelcase */

// Mock properties for frontend previews
// Get rid of this once backend has completed serving the props
export interface ItGovTaskSystemIntakeWithMockData
  // eslint-disable-next-line camelcase
  extends GetGovernanceTaskList_systemIntake {
  intakeFormPctComplete?: number;
  governanceRequestFeedbackCompletedAt?: string | null;
  bizCaseDraftUpdatedAt?: string | null;
  bizCaseDraftSubmittedAt?: string | null;
  bizCaseFinalPctComplete?: number;
  bizCaseFinalUpdatedAt?: string | null;
  bizCaseFinalSubmittedAt?: string | null;
  decisionAndNextStepsSubmittedAt?: string | null;
}

export interface GetGovernanceTaskListWithMockData {
  systemIntake: ItGovTaskSystemIntakeWithMockData;
}
