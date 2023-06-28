import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import TaskListItem, {
  TaskListContainer,
  TaskListDescription
} from 'components/TaskList';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';
import { ITGovIntakeFormStatus } from 'types/graphql-global-types';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

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
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('itGovernance'), url: '/system/making-a-request' },
          {
            text: t('taskList.heading')
          }
        ]}
      />

      <Grid row gap className="margin-top-6">
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-y-0">
            {t('taskList.heading')}
          </PageHeading>

          <div className="line-height-body-4">
            <div className="font-body-lg line-height-body-5 text-light">
              {t('taskList.description')}
            </div>

            <TaskListContainer className="margin-top-4">
              {/* Fill out the initial request form */}
              <TaskListItem
                heading="Fill"
                status={ITGovIntakeFormStatus.READY}
                testId={kebabCase('Fill')}
              >
                <TaskListDescription>
                  <p>Tell</p>
                </TaskListDescription>
                <UswdsReactLink
                  variant="unstyled"
                  className="usa-button"
                  to="./"
                >
                  {t('button.start')}
                </UswdsReactLink>
              </TaskListItem>
            </TaskListContainer>
          </div>
        </Grid>

        {/* Sidebar */}
        <Grid tablet={{ col: 3 }}>
          <div className="line-height-body-4 padding-top-3 border-top border-top-width-05 border-primary-lighter">
            <div>
              <UswdsReactLink to="/system/making-a-request">
                {t('button.saveAndExit')}
              </UswdsReactLink>
            </div>
            <div className="margin-top-1">
              <Button type="button" unstyled className="text-error">
                {t('button.removeYourRequest')}
              </Button>
            </div>

            <h4 className="line-height-body-2 margin-top-3 margin-bottom-1">
              {t('taskList.help')}
            </h4>
            <div className="margin-top-1">
              <UswdsReactLink
                to="/help/it-governance/steps-overview/new-system"
                target="_blank"
              >
                {t('taskList.stepsInvolved')}
              </UswdsReactLink>
            </div>
            <div className="margin-top-1">
              <UswdsReactLink
                to="/help/it-governance/sample-business-case"
                target="_blank"
              >
                {t('taskList.sampleBusinessCase')}
              </UswdsReactLink>
            </div>
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
}

export default GovernanceTaskList;
