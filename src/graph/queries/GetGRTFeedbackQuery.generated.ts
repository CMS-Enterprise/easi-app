import * as Types from '../generated/generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GrtFeedbackFieldsFragment = (
  { __typename?: 'GRTFeedback' }
  & Pick<Types.GrtFeedback, 'id' | 'feedbackType' | 'feedback' | 'createdAt'>
);

export type GetGrtFeedbackQueryVariables = Types.Exact<{
  intakeID: Types.Scalars['UUID'];
}>;


export type GetGrtFeedbackQuery = (
  { __typename?: 'Query' }
  & { systemIntake?: Types.Maybe<(
    { __typename?: 'SystemIntake' }
    & { grtFeedbacks: Array<(
      { __typename?: 'GRTFeedback' }
      & GrtFeedbackFieldsFragment
    )> }
  )> }
);

export const GrtFeedbackFieldsFragmentDoc = gql`
    fragment GRTFeedbackFields on GRTFeedback {
  id
  feedbackType
  feedback
  createdAt
}
    `;
export const GetGrtFeedbackDocument = gql`
    query GetGRTFeedback($intakeID: UUID!) {
  systemIntake(id: $intakeID) {
    grtFeedbacks {
      ...GRTFeedbackFields
    }
  }
}
    ${GrtFeedbackFieldsFragmentDoc}`;

/**
 * __useGetGrtFeedbackQuery__
 *
 * To run a query within a React component, call `useGetGrtFeedbackQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrtFeedbackQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrtFeedbackQuery({
 *   variables: {
 *      intakeID: // value for 'intakeID'
 *   },
 * });
 */
export function useGetGrtFeedbackQuery(baseOptions: Apollo.QueryHookOptions<GetGrtFeedbackQuery, GetGrtFeedbackQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrtFeedbackQuery, GetGrtFeedbackQueryVariables>(GetGrtFeedbackDocument, options);
      }
export function useGetGrtFeedbackLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrtFeedbackQuery, GetGrtFeedbackQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrtFeedbackQuery, GetGrtFeedbackQueryVariables>(GetGrtFeedbackDocument, options);
        }
export type GetGrtFeedbackQueryHookResult = ReturnType<typeof useGetGrtFeedbackQuery>;
export type GetGrtFeedbackLazyQueryHookResult = ReturnType<typeof useGetGrtFeedbackLazyQuery>;
export type GetGrtFeedbackQueryResult = Apollo.QueryResult<GetGrtFeedbackQuery, GetGrtFeedbackQueryVariables>;