import { useQuery } from '@apollo/client';

import GetSystemIntakeRelatedRequests from '../../queries/GetSystemIntakeRelatedRequests';
import { GetSystemIntake } from '../../queries/types/GetSystemIntake';

const RelatedRequestsTable = () => {
  // make api call
  const { loading, error, data } = useQuery<GetSystemIntake>(
    GetSystemIntakeRelatedRequests
  );
};

export default RelatedRequestsTable;
