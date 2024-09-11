import { DocumentNode, FetchResult, GraphQLRequest } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';

export type NonNullableProps<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type FormFieldProps<T> = NonNullableProps<Required<T>>;

/** Extends `GraphQLRequest` to optionally enforce stricter typing on `variables` property */
interface MockedRequest<
  TVariables extends Record<string, any> = Record<string, any>
> extends GraphQLRequest {
  query: DocumentNode;
  variables: TVariables;
}

/** Extends `MockedResponse` to optionally enforce stricter typing on `request` and `result` properties */
export interface MockedQuery<
  TData extends Record<string, any> = Record<string, any>,
  TVariables extends Record<string, any> = Record<string, any>
> extends MockedResponse<TData> {
  request: MockedRequest<TVariables>;
  result: FetchResult<TData>;
}
