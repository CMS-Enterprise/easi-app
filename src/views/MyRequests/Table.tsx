import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import GetRequestsQuery from 'queries/GetRequestsQuery';
import { GetRequests, GetRequestsVariables } from 'queries/types/GetRequests';

import { RequestType } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';

const Table = () => {
  const { loading, error, data } = useQuery<GetRequests, GetRequestsVariables>(
    GetRequestsQuery,
    {
      variables: { first: 20 },
      fetchPolicy: 'cache-and-network'
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
    data.requests &&
    data.requests.edges.map(edge => {
      return edge.node;
    });

  return (
    <ul>
      {requests?.map(request => {
        let link: string;
        switch (request.type) {
          case RequestType.ACCESSIBILITY_REQUEST:
            link = `/508/requests/${request.id}`;
            break;
          case RequestType.GOVERNANCE_REQUEST:
            link = `/governance-task-list/${request.id}`;
            break;
          default:
            link = '/';
        }

        return (
          <li key={request.id}>
            <UswdsLink asCustom={Link} to={link}>
              {request.name || 'Unnamed Request'}
            </UswdsLink>
            ,{' '}
            {request.submittedAt
              ? formatDate(request.submittedAt)
              : 'Not Submitted'}
            , {request.type}
          </li>
        );
      })}
    </ul>
  );
};

export default Table;
