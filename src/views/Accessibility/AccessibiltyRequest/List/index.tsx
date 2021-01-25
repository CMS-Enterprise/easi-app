import React from 'react';
import { useQuery } from '@apollo/client';
import GetAccessibilityRequestsQuery from 'queries/GetAccessibilityRequestsQuery';
import { GetAccessibilityRequests } from 'queries/types/GetAccessibilityRequests';

import AccessibilityRequestsTable from 'components/AccessibilityRequestsTable';

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
      return { name: edge.node.name, id: edge.node.id };
    });

  return <AccessibilityRequestsTable requests={requests || []} />;
};

export default List;
