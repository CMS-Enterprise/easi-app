// useApolloCacheQuery.ts
import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useApolloClient,
  useQuery
} from '@apollo/client';

/** Custom hook to query the cache to determine if query result exists already */
export default function useApolloCacheQuery<
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
      !cache.diff({
        query: cache.transformDocument(query),
        variables: options?.variables,
        returnPartialData: true,
        optimistic: false
      }).complete && queryResult.loading
  };
}
