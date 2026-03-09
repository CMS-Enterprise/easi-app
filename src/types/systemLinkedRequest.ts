import { GetLinkedRequestsQuery } from 'gql/generated/graphql';

type LinkedSystemIntake = NonNullable<
  NonNullable<GetLinkedRequestsQuery['cedarSystemDetails']>['cedarSystem']
>['linkedSystemIntakes'][number];

type LinkedTrbRequest = NonNullable<
  NonNullable<GetLinkedRequestsQuery['cedarSystemDetails']>['cedarSystem']
>['linkedTrbRequests'][number];

export type { LinkedSystemIntake, LinkedTrbRequest };
export type SystemLinkedRequest = LinkedSystemIntake | LinkedTrbRequest;
