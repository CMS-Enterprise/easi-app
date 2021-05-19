import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import GetRequestsQuery from 'queries/GetRequestsQuery';
import { GetRequests } from 'queries/types/GetRequests';

const Table = () => {
  const { loading, error, data } = useQuery<GetRequests>(GetRequestsQuery, {
    variables: { first: 20 },
    fetchPolicy: 'cache-and-network'
  });

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  const requests =
    data &&
    data.requests &&
    data.requests.edges.map(edge => {
      return edge.node;
    });

  return (
    <ul>
      {requests?.map(request => (
        <li key={request.id}>
          <UswdsLink asCustom={Link} to={`/508/requests/${request.id}`}>
            {request.name}
          </UswdsLink>
        </li>
      ))}
    </ul>
  );
};

export default Table;
