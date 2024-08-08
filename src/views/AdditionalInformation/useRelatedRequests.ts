import { useQuery } from '@apollo/client';

import GetSystemIntakeRelatedRequestsQuery from '../../queries/GetSystemIntakeRelatedRequestsQuery';
import {
  GetSystemIntakeRelatedRequests,
  GetSystemIntakeRelatedRequestsVariables
} from '../../queries/types/GetSystemIntakeRelatedRequests';
import {
  GetTRBRequestRelatedRequests,
  GetTRBRequestRelatedRequestsVariables
} from '../../queries/types/GetTRBRequestRelatedRequests';

const useRelatedRequests = (requestID: string, type: 'trb' | 'itgov') => {
  const sysIntakeRes = useQuery<
    GetSystemIntakeRelatedRequests,
    GetSystemIntakeRelatedRequestsVariables
  >(GetSystemIntakeRelatedRequestsQuery, {
    variables: { systemIntakeID: requestID },
    fetchPolicy: 'cache-and-network',
    skip: type !== 'itgov'
  });

  const trbRequestRes = useQuery<
    GetTRBRequestRelatedRequests,
    GetTRBRequestRelatedRequestsVariables
  >(GetSystemIntakeRelatedRequestsQuery, {
    variables: { trbRequestID: requestID },
    fetchPolicy: 'cache-and-network',
    skip: type !== 'trb'
  });

  return {
    data:
      type === 'trb'
        ? trbRequestRes.data?.trbRequest
        : sysIntakeRes.data?.systemIntake,

    loading: type === 'trb' ? trbRequestRes.loading : sysIntakeRes.loading,
    error: type === 'trb' ? trbRequestRes.error : sysIntakeRes.error
  };

  // return type === 'trb' ? trbRequestRes.data?.trbRequest : sysIntakeRes;
};

export default useRelatedRequests;
