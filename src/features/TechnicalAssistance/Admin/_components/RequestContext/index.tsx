/*
Context wrapper for getting basic TRB request info from anywhere in the TRB Admin views
Alleviates prop drilling and over querying
Updates on route change, as these values need to be reflected by current changes in Admin data
*/

import React, { createContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryResult } from '@apollo/client';
import {
  GetTRBRequestSummaryQuery,
  useGetTRBRequestSummaryQuery
} from 'gql/generated/graphql';

type TRBRequestInfoWrapperProps = {
  children: React.ReactNode;
};

type TRBRequestContextType = Pick<
  QueryResult<GetTRBRequestSummaryQuery>,
  'data' | 'loading' | 'error' | 'refetch'
>;

const initialTRBRequestContext: TRBRequestContextType = {
  loading: false,
  error: undefined,
  data: undefined,
  refetch: () => new Promise((resolve, reject) => {})
};

// Create the trb request info context - can be used anywhere in a trb admin request view
export const TRBRequestContext = createContext<TRBRequestContextType>(
  initialTRBRequestContext
);

const TRBRequestInfoWrapper = ({ children }: TRBRequestInfoWrapperProps) => {
  const { pathname } = useLocation();

  // Gets TRB request ID from url
  const requestID: string | undefined = pathname.split('/')[2];

  // TRB request query
  const { data, loading, error, refetch } = useGetTRBRequestSummaryQuery({
    variables: { id: requestID },
    skip: !requestID
  });

  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  return (
    // The Provider gives access to the context to its children
    <TRBRequestContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </TRBRequestContext.Provider>
  );
};

export default TRBRequestInfoWrapper;
