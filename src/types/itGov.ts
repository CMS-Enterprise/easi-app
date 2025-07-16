/* eslint-disable camelcase */
import { GetGovernanceTaskListQuery } from 'gql/generated/graphql';

export type ITGovTaskSystemIntake = NonNullable<
  GetGovernanceTaskListQuery['systemIntake']
>;

export type ITGovernanceViewType = 'admin' | 'requester';
