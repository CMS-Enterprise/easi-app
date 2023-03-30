/*
Context wrapper for getting basic TRB request info from anywhere in the TRB Admin views
Alleviates prop drilling and over querying
Updates on route change, as these values need to be reflected by current changes in Admin data
*/

import React, { createContext } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryResult } from '@apollo/client';

import useCacheQuery from 'hooks/useCacheQuery';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import {
  GetTrbRequestSummary,
  GetTrbRequestSummaryVariables
} from 'queries/types/GetTrbRequestSummary';

type TRBRequestInfoWrapperProps = {
  children: React.ReactNode;
};

type TRBRequestContextType = Pick<
  QueryResult<GetTrbRequestSummary, GetTrbRequestSummaryVariables>,
  'data' | 'loading' | 'error'
>;

const initialTRBRequestContet: TRBRequestContextType = {
  loading: false,
  error: undefined,
  data: undefined
};

// Create the trb request info context - can be used anywhere in a trb admin request view
export const TRBRequestContext = createContext<TRBRequestContextType>(
  initialTRBRequestContet
);

const TRBRequestInfoWrapper = ({ children }: TRBRequestInfoWrapperProps) => {
  const { pathname } = useLocation();

  // Gets TRB request ID from url
  const requestID: string | undefined = pathname.split('/')[2];

  // TRB request query
  const { data, loading, error } = useCacheQuery<
    GetTrbRequestSummary,
    GetTrbRequestSummaryVariables
  >(GetTrbRequestSummaryQuery, {
    variables: { id: requestID },
    skip: !requestID
  });

  return (
    // The Provider gives access to the context to its children
    <TRBRequestContext.Provider value={{ data, loading, error }}>
      {children}
    </TRBRequestContext.Provider>
  );
};

export default TRBRequestInfoWrapper;
