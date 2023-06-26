import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';

function GovernanceTaskList() {
  const { systemId } = useParams<{ systemId: string }>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useQuery<
    GetGovernanceTaskList,
    GetGovernanceTaskListVariables
  >(GetGovernanceTaskListQuery, {
    variables: {
      id: systemId
    }
  });

  return <div>GovernanceTaskList V2</div>;
}

export default GovernanceTaskList;
