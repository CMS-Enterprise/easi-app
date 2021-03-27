import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

const defaultOptions = {};
export type GetSystemIntakeQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;

export type GetSystemIntakeQuery = { __typename?: 'Query' } & {
  systemIntake?: Maybe<
    { __typename?: 'SystemIntake' } & Pick<
      SystemIntake,
      | 'id'
      | 'adminLead'
      | 'businessNeed'
      | 'businessSolution'
      | 'currentStage'
      | 'grbDate'
      | 'grtDate'
      | 'lcid'
      | 'needsEaSupport'
      | 'requestName'
      | 'requestType'
      | 'status'
      | 'submittedAt'
    > & {
        businessOwner?: Maybe<
          { __typename?: 'SystemIntakeBusinessOwner' } & Pick<
            SystemIntakeBusinessOwner,
            'component' | 'name'
          >
        >;
        contract?: Maybe<
          { __typename?: 'SystemIntakeContract' } & Pick<
            SystemIntakeContract,
            'contractor' | 'hasContract' | 'vehicle'
          > & {
              endDate?: Maybe<
                { __typename?: 'ContractDate' } & Pick<
                  ContractDate,
                  'day' | 'month' | 'year'
                >
              >;
              startDate?: Maybe<
                { __typename?: 'ContractDate' } & Pick<
                  ContractDate,
                  'day' | 'month' | 'year'
                >
              >;
            }
        >;
        costs?: Maybe<
          { __typename?: 'SystemIntakeCosts' } & Pick<
            SystemIntakeCosts,
            'isExpectingIncrease' | 'expectedIncreaseAmount'
          >
        >;
        grtFeedbacks: Array<
          { __typename?: 'GRTFeedback' } & Pick<
            GrtFeedback,
            'feedback' | 'feedbackType' | 'createdAt'
          >
        >;
        governanceTeams?: Maybe<
          { __typename?: 'SystemIntakeGovernanceTeam' } & Pick<
            SystemIntakeGovernanceTeam,
            'isPresent'
          > & {
              teams?: Maybe<
                Array<
                  { __typename?: 'SystemIntakeCollaborator' } & Pick<
                    SystemIntakeCollaborator,
                    'acronym' | 'collaborator' | 'key' | 'label' | 'name'
                  >
                >
              >;
            }
        >;
        isso?: Maybe<
          { __typename?: 'SystemIntakeISSO' } & Pick<
            SystemIntakeIsso,
            'isPresent' | 'name'
          >
        >;
        fundingSource?: Maybe<
          { __typename?: 'SystemIntakeFundingSource' } & Pick<
            SystemIntakeFundingSource,
            'fundingNumber' | 'isFunded' | 'source'
          >
        >;
        productManager?: Maybe<
          { __typename?: 'SystemIntakeProductManager' } & Pick<
            SystemIntakeProductManager,
            'component' | 'name'
          >
        >;
        requester: { __typename?: 'SystemIntakeRequester' } & Pick<
          SystemIntakeRequester,
          'component' | 'email' | 'name'
        >;
      }
  >;
};

export const GetSystemIntakeDocument = gql`
  query GetSystemIntake($id: UUID!) {
    systemIntake(id: $id) {
      id
      adminLead
      businessNeed
      businessSolution
      businessOwner {
        component
        name
      }
      contract {
        contractor
        endDate {
          day
          month
          year
        }
        hasContract
        startDate {
          day
          month
          year
        }
        vehicle
      }
      costs {
        isExpectingIncrease
        expectedIncreaseAmount
      }
      currentStage
      grbDate
      grtDate
      grtFeedbacks {
        feedback
        feedbackType
        createdAt
      }
      governanceTeams {
        isPresent
        teams {
          acronym
          collaborator
          key
          label
          name
        }
      }
      isso {
        isPresent
        name
      }
      fundingSource {
        fundingNumber
        isFunded
        source
      }
      lcid
      needsEaSupport
      productManager {
        component
        name
      }
      requester {
        component
        email
        name
      }
      requestName
      requestType
      status
      submittedAt
    }
  }
`;

/**
 * __useGetSystemIntakeQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemIntakeQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSystemIntakeQuery,
    GetSystemIntakeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSystemIntakeQuery, GetSystemIntakeQueryVariables>(
    GetSystemIntakeDocument,
    options
  );
}
export function useGetSystemIntakeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSystemIntakeQuery,
    GetSystemIntakeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetSystemIntakeQuery,
    GetSystemIntakeQueryVariables
  >(GetSystemIntakeDocument, options);
}
export type GetSystemIntakeQueryHookResult = ReturnType<
  typeof useGetSystemIntakeQuery
>;
export type GetSystemIntakeLazyQueryHookResult = ReturnType<
  typeof useGetSystemIntakeLazyQuery
>;
export type GetSystemIntakeQueryResult = Apollo.QueryResult<
  GetSystemIntakeQuery,
  GetSystemIntakeQueryVariables
>;
