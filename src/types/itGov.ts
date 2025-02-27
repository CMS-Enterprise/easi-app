/* eslint-disable camelcase */
import { GetGovernanceTaskListQuery } from 'gql/generated/graphql';

export type ITGovTaskStatuses = NonNullable<
  GetGovernanceTaskListQuery['systemIntake']
>['itGovTaskStatuses'];

export type ITGovTaskSystemIntake = NonNullable<
  GetGovernanceTaskListQuery['systemIntake']
>;

// Mock properties for frontend previews
// Get rid of this once backend has completed serving the props
export interface ItGovTaskSystemIntakeWithMockData
  // eslint-disable-next-line camelcase
  extends ITGovTaskSystemIntake {
  itGovTaskStatuses: ITGovTaskStatuses;
}

export interface GetGovernanceTaskListWithMockData {
  systemIntake: ItGovTaskSystemIntakeWithMockData;
}
