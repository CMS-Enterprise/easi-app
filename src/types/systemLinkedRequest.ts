import { GetLinkedRequestsQuery } from 'gql/generated/graphql';

type LinkedSystemIntake = NonNullable<
  NonNullable<GetLinkedRequestsQuery['cedarSystemWorkspace']>['cedarSystem']
>['linkedSystemIntakes'][number];

type LinkedTrbRequest = NonNullable<
  NonNullable<GetLinkedRequestsQuery['cedarSystemWorkspace']>['cedarSystem']
>['linkedTrbRequests'][number];

export type { LinkedSystemIntake, LinkedTrbRequest };
export type SystemLinkedRequest = LinkedSystemIntake | LinkedTrbRequest;
