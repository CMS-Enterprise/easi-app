import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import GetTrbTasklistQuery from 'queries/GetTrbTasklistQuery';
import {
  GetTrbTasklist,
  GetTrbTasklistVariables
} from 'queries/types/GetTrbTasklist';
import TaskListItem, {
  TaskListDescription
} from 'views/GovernanceTaskList/TaskListItem';
import NotFoundPartial from 'views/NotFound/NotFoundPartial';

import Breadcrumbs from './Breadcrumbs';

function TaskList() {
  const { t } = useTranslation('technicalAssistance');
  const requestTypeText = t<Record<string, { heading: string }>>(
    'requestType.type',
    {
      returnObjects: true
    }
  );
  const taskListText = t<{ heading: string; text: string; list?: string[] }[]>(
    'taskList.taskList',
    {
      returnObjects: true
    }
  );

  const { id } = useParams<{
    id: string;
  }>();

  const { data, error, loading } = useQuery<
    GetTrbTasklist,
    GetTrbTasklistVariables
  >(GetTrbTasklistQuery, {
    variables: {
      id
    }
  });

  if (error) {
    return (
      <GridContainer className="width-full">
        <NotFoundPartial />
      </GridContainer>
    );
  }

  const formStatus = data?.trbRequest.form.status;

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('heading'), url: '/trb' },
          {
            text: t('taskList.heading')
          }
        ]}
      />

      {data ? (
        <Grid row>
          <Grid tablet={{ col: 9 }}>
            <PageHeading className="margin-bottom-0">
              {t('taskList.heading')}
            </PageHeading>

            <div>
              {data && (
                <div>
                  <div className="trb-request-type">
                    {requestTypeText[data.trbRequest.type].heading}
                  </div>

                  <UswdsReactLink to={`/trb/type/${id}`}>
                    {t('steps.changeRequestType')}
                  </UswdsReactLink>
                </div>
              )}

              <ol className="governance-task-list__task-list governance-task-list__task-list--primary">
                {/* Fill out the initial request form */}
                <TaskListItem
                  heading={taskListText[0].heading}
                  status={formStatus || ''}
                  testId={kebabCase(taskListText[0].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[0].text}</p>
                  </TaskListDescription>

                  <UswdsReactLink
                    variant="unstyled"
                    className="usa-button"
                    to={`/trb/requests/${id}`}
                  >
                    {t(
                      formStatus === 'READY_TO_START'
                        ? 'button.start'
                        : 'button.continue'
                    )}
                  </UswdsReactLink>
                </TaskListItem>

                {/* Feedback from initial review */}
                <TaskListItem
                  heading={taskListText[1].heading}
                  status="CANNOT_START"
                  testId={kebabCase(taskListText[1].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[1].text}</p>
                  </TaskListDescription>
                </TaskListItem>

                {/* Prepare for the TRB consult session */}
                <TaskListItem
                  heading={taskListText[2].heading}
                  status="CANNOT_START"
                  testId={kebabCase(taskListText[2].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[2].text}</p>
                    <ul>
                      <li>{taskListText[2].list![0]}</li>
                      <li>{taskListText[2].list![1]}</li>
                      <li>{taskListText[2].list![2]}</li>
                    </ul>
                  </TaskListDescription>
                </TaskListItem>

                {/* Attend the TRB consult session */}
                <TaskListItem
                  heading={taskListText[3].heading}
                  status="CANNOT_START"
                  testId={kebabCase(taskListText[3].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[3].text}</p>
                  </TaskListDescription>
                </TaskListItem>

                {/* Advice letter and next steps */}
                <TaskListItem
                  heading={taskListText[4].heading}
                  status="CANNOT_START"
                  testId={kebabCase(taskListText[4].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[4].text}</p>
                  </TaskListDescription>
                </TaskListItem>
              </ol>
            </div>
          </Grid>
        </Grid>
      ) : (
        loading && <PageLoading />
      )}
    </GridContainer>
  );
}

export default TaskList;
