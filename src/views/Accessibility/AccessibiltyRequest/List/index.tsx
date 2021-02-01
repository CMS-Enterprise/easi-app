import React from 'react';
import { useQuery } from '@apollo/client';
import GetAccessibilityRequestsQuery from 'queries/GetAccessibilityRequestsQuery';
import { GetAccessibilityRequests } from 'queries/types/GetAccessibilityRequests';

import AccessibilityRequestsTable from 'components/AccessibilityRequestsTable';
import ScyllaPage from 'components/ScyllaPage';

const List = () => {
  const { loading, error, data } = useQuery<GetAccessibilityRequests>(
    GetAccessibilityRequestsQuery,
    {
      variables: {
        first: 20
      }
    }
  );

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  const requests =
    data &&
    data.accessibilityRequests &&
    data.accessibilityRequests.edges.map(edge => {
      return edge.node;
    });

  return (
    <ScyllaPage>
      <AccessibilityRequestsTable requests={requests || []} />
    </ScyllaPage>
  );
};

export default List;
