import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import TaskListItem, {
  TaskListContainer,
  TaskListDescription
} from 'components/TaskList';
import GetTrbTasklistQuery from 'queries/GetTrbTasklistQuery';
import {
  GetTrbTasklist,
  GetTrbTasklistVariables
} from 'queries/types/GetTrbTasklist';
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

      {data && formStatus ? (
        <Grid row gap className="margin-top-6">
          <Grid tabletLg={{ col: 9 }}>
            <PageHeading className="margin-y-0">
              {t('taskList.heading')}
            </PageHeading>

            <div className="line-height-body-4">
              {data && (
                <div>
                  <div className="trb-request-type text-light font-body-lg">
                    {requestTypeText[data.trbRequest.type].heading}
                  </div>

                  <UswdsReactLink to={`/trb/type/${id}`}>
                    {t('steps.changeRequestType')}
                  </UswdsReactLink>
                </div>
              )}

              <TaskListContainer className="margin-top-4">
                {/* Fill out the initial request form */}
                <TaskListItem
                  heading={taskListText[0].heading}
                  status={formStatus}
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
              </TaskListContainer>
            </div>
          </Grid>

          {/* Sidebar */}
          <Grid tabletLg={{ col: 3 }}>
            <div className="line-height-body-4 padding-top-3 border-top border-top-width-05 border-primary-lighter">
              <div>
                <UswdsReactLink to="/trb">
                  {t('button.saveAndExit')}
                </UswdsReactLink>
              </div>
              <div className="margin-top-1">
                <Button type="button" unstyled className="text-error">
                  {t('button.removeYourRequest')}
                </Button>
              </div>
              <h4 className="line-height-body-2 margin-top-3 margin-bottom-1">
                {t('taskList.additionalHelp')}
              </h4>
              <div className="text-base">{t('taskList.helpLinksNewTab')}</div>
              <div className="margin-top-1">
                <UswdsReactLink to=".">
                  {t('taskList.stepsInvolved')}
                </UswdsReactLink>
              </div>
              <div className="margin-top-1">
                <UswdsReactLink to=".">
                  {t('taskList.sampleRequest')}
                </UswdsReactLink>
              </div>
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
