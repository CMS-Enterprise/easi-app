import React from 'react';
import { useQuery } from '@apollo/client';
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

  console.log(requests);

  return <p>Table goes here</p>;
};

export default Table;
