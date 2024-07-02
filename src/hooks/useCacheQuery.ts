/*
useQuery wrapper hook to return an accurate loading state for the fetch-policy of cache-and-network
Computes loading state of both cache and network loading
Returns loading=false if cache exists, regardless if network is making a request
Returns loading=true if cache does not exist and network is making a request

Current EASI Apollo fetchPolicy is set to 'cache-and-network' as default
Apollo's loading state only reflects network requests, despite the presence of cache
Since 'cache-and-network' always sends a network request, the loading state will never reflect the presence of cache

Issue and alternative solutions referenced here:
https://github.com/apollographql/react-apollo/issues/2601
*/

/*
Implementation (should be identical to `useQuery`):

const { data, loading, error } = useCacheQuery<
    GetQueryType,
    GetQueryVariables
  >(GetQuery, {
    variables: { id: id }
  });

if (loading) {
    return <PageLoading />
}
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
  TVariables extends OperationVariables = OperationVariables
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
