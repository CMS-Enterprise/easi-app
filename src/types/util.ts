import {
  DocumentNode,
  FetchResult,
  GraphQLRequest,
  OperationVariables,
  Unmasked
} from '@apollo/client';
import { MockedResponse, ResultFunction } from '@apollo/client/testing';

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
export interface MockedQuery<TData = any, TVariables = OperationVariables>
  extends MockedResponse<TData, TVariables> {
  request: MockedRequest<
    TVariables extends Record<string, any> ? TVariables : never
  >;
  result?:
    | FetchResult<Unmasked<TData>>
    | ResultFunction<FetchResult<Unmasked<TData>>, TVariables>;
}

/** i18Next translation object */
export type Translation<T extends string> = Record<
  // Key allows for use of i18next context or plurals
  T | `${T}_${string}`,
  string
>;
