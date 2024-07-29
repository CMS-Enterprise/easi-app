import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import GetSystemIntakeRelatedRequests from '../../queries/GetSystemIntakeRelatedRequests';
import { GetSystemIntake } from '../../queries/types/GetSystemIntake';
import { GetSystemIntakeRelatedRequestsVariables } from '../../queries/types/GetSystemIntakeRelatedRequests';

import { LinkedRequestForTable } from './tableMap';

const RelatedRequestsTable = ({ requestID }: { requestID: string }) => {
  // make api call
  const { loading, error, data } = useQuery<
    GetSystemIntake,
    GetSystemIntakeRelatedRequestsVariables
  >(GetSystemIntakeRelatedRequests, {
    variables: { systemIntakeID: requestID },
    fetchPolicy: 'cache-and-network'
  });

  const tableData = useMemo(() => {
    if (error !== undefined) {
      return [];
    }

    if (loading) {
      return [];
    }

    if (data === undefined || data.systemIntake === null) {
      return [];
    }

    const {
      systemIntake: { relatedIntakes, relatedTRBRequests }
    } = data;

    const requests: LinkedRequestForTable[] = [];

    // handle related intakes
    relatedIntakes.forEach(relatedIntake => {
      requests.push({
        contractNumber: relatedIntake.contractNumbers.join(', '),
        process: 'IT Governance',
        projectTitle: relatedIntake.requestName || '',
        status: relatedIntake.decisionState,
        submissionDate: relatedIntake.submittedAt || ''
      });
    });

    // handle trb requests
    relatedTRBRequests.forEach(relatedTRBRequest => {
      requests.push({
        contractNumber: relatedTRBRequest.contractNumbers.join(', '),
        process: 'TRB',
        projectTitle: relatedTRBRequest.name || '',
        status: relatedTRBRequest.status,
        submissionDate: relatedTRBRequest.createdAt
      });
    });
    return requests.sort((a, b) => {
      return (
        new Date(a.submissionDate).valueOf() -
        new Date(b.submissionDate).valueOf()
      );
    });
  }, [data, error, loading]);

  return <div>table!</div>;
};

export default RelatedRequestsTable;
