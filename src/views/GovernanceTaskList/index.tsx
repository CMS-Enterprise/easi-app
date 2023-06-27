import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import PageHeading from 'components/PageHeading';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';

function GovernanceTaskList() {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('itGov');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useQuery<
    GetGovernanceTaskList,
    GetGovernanceTaskListVariables
  >(GetGovernanceTaskListQuery, {
    variables: {
      id: systemId
    }
  });

  return (
    <div>
      <PageHeading>{t('taskList.heading')}</PageHeading>
    </div>
  );
}

export default GovernanceTaskList;
