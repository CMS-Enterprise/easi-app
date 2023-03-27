/*
useQuery wrapper hook to return an accurate loading state for the fetch-policy of cache-and-network
Computes loading state of both cache and network loading
Returns loading=false if cache exists, regardless if network is making a request
Returns loading=true if cache does not exist and network is making a request
*/

import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useApolloClient,
  useQuery
} from '@apollo/client';

export default function useCacheQuery<
  TData = any,
  TVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  const { cache } = useApolloClient();

  const queryResult = useQuery<TData, TVariables>(query, options);

  return {
    ...queryResult,
    loading:
      // Checks to see if the existing cache can be fetched for the current request
      // Returns a combined state of an existing complete cache and network loading
      !cache.diff({
        query: cache.transformDocument(query),
        variables: options?.variables,
        returnPartialData: true,
        optimistic: false
      }).complete && queryResult.loading
  };
}
