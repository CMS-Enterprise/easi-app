import { ApolloError, useQuery } from '@apollo/client';

import GetSystemIntakeRelatedRequestsQuery from 'queries/GetSystemIntakeRelatedRequestsQuery';
import GetTRBRequestRelatedRequestsQuery from 'queries/GetTRBRequestRelatedRequestsQuery';
import {
  GetSystemIntakeRelatedRequests,
  GetSystemIntakeRelatedRequests_systemIntake as SystemIntakeRelatedRequests,
  GetSystemIntakeRelatedRequestsVariables
} from 'queries/types/GetSystemIntakeRelatedRequests';
import {
  GetTRBRequestRelatedRequests,
  GetTRBRequestRelatedRequests_trbRequest as TRBRequestRelatedRequests,
  GetTRBRequestRelatedRequestsVariables
} from 'queries/types/GetTRBRequestRelatedRequests';
import { RequestType } from 'types/requestType';

const useRelatedRequests = (
  requestID: string,
  type: RequestType
): {
  error: ApolloError | undefined;
  loading: boolean;
  data:
    | SystemIntakeRelatedRequests
    | TRBRequestRelatedRequests
    | null
    | undefined;
} => {
  const {
    error: systemIntakeError,
    loading: systemIntakeLoading,
    data: systemIntakeData
  } = useQuery<
    GetSystemIntakeRelatedRequests,
    GetSystemIntakeRelatedRequestsVariables
  >(GetSystemIntakeRelatedRequestsQuery, {
    variables: { systemIntakeID: requestID },
    fetchPolicy: 'cache-and-network',
    // avoid making API call if not needed
    skip: type !== 'itgov'
  });

  const {
    error: trbRequestError,
    loading: trbRequestLoading,
    data: trbRequestData
  } = useQuery<
    GetTRBRequestRelatedRequests,
    GetTRBRequestRelatedRequestsVariables
  >(GetTRBRequestRelatedRequestsQuery, {
    variables: { trbRequestID: requestID },
    fetchPolicy: 'cache-and-network',
    // avoid making API call if not needed
    skip: type !== 'trb'
  });

  return type === 'trb'
    ? {
        error: trbRequestError,
        loading: trbRequestLoading,
        data: trbRequestData?.trbRequest
      }
    : {
        error: systemIntakeError,
        loading: systemIntakeLoading,
        data: systemIntakeData?.systemIntake
      };
};

export default useRelatedRequests;
