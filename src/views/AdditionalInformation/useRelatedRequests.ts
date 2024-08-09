import { ApolloError } from '@apollo/client';
import {
  GetSystemIntakeRelatedRequestsQuery,
  GetTrbRequestRelatedRequestsQuery,
  useGetSystemIntakeRelatedRequestsQuery,
  useGetTrbRequestRelatedRequestsQuery
} from 'gql/gen/graphql';

import { RequestType } from 'types/requestType';

const useRelatedRequests = (
  requestID: string,
  type: RequestType
): {
  error: ApolloError | undefined;
  loading: boolean;
  data:
    | GetSystemIntakeRelatedRequestsQuery['systemIntake']
    | GetTrbRequestRelatedRequestsQuery['trbRequest']
    | null
    | undefined;
} => {
  const {
    error: systemIntakeError,
    loading: systemIntakeLoading,
    data: systemIntakeData
  } = useGetSystemIntakeRelatedRequestsQuery({
    variables: { systemIntakeID: requestID },
    fetchPolicy: 'cache-and-network',
    // avoid making API call if not needed
    skip: type !== 'itgov'
  });

  const {
    error: trbRequestError,
    loading: trbRequestLoading,
    data: trbRequestData
  } = useGetTrbRequestRelatedRequestsQuery({
    variables: { trbRequestID: requestID },
    fetchPolicy: 'cache-and-network',
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
