import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { TaskListContainer } from 'components/TaskList';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';
import NotFound from 'views/NotFound';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

import GovTaskBizCaseDraft from './GovTaskBizCaseDraft';
import GovTaskBizCaseFinal from './GovTaskBizCaseFinal';
import GovTaskDecisionAndNextSteps from './GovTaskDecisionAndNextSteps';
import GovTaskFeedbackFromInitialReview from './GovTaskFeedbackFromInitialReview';
import GovTaskGrbMeeting from './GovTaskGrbMeeting';
import GovTaskGrtMeeting from './GovTaskGrtMeeting';
import GovTaskIntakeForm from './GovTaskIntakeForm';

function GovernanceTaskList() {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('itGov');

  const { data, loading, error } = useQuery<
    GetGovernanceTaskList,
    GetGovernanceTaskListVariables
  >(GetGovernanceTaskListQuery, {
    variables: {
      id: systemId
    }
  });

  const systemIntake = data?.systemIntake;

  if (error) {
    return <NotFound />;
  }

  return (
    <MainContent className="margin-bottom-5 desktop:margin-bottom-10">
      <GridContainer className="width-full">
        <Breadcrumbs
          items={[
            { text: t('itGovernance'), url: '/system/making-a-request' },
            {
              text: t('taskList.heading')
            }
          ]}
        />

        {loading && <PageLoading />}

        {!loading && systemIntake && (
          <Grid row gap className="margin-top-6">
            <Grid tablet={{ col: 9 }}>
              <PageHeading className="margin-y-0">
                {t('taskList.heading')}
              </PageHeading>

              <div className="line-height-body-4">
                <p className="font-body-lg line-height-body-5 text-light margin-y-0">
                  {t('taskList.description')}
                </p>

                <TaskListContainer className="margin-top-4">
                  {/* 1. Fill out the Intake Request form */}
                  <GovTaskIntakeForm {...systemIntake} />
                  {/* 2. Feedback from initial review */}
                  <GovTaskFeedbackFromInitialReview {...systemIntake} />
                  {/* 3. Prepare a draft Business Case */}
                  <GovTaskBizCaseDraft {...systemIntake} />
                  {/* 4. Attend the GRT meeting */}
                  <GovTaskGrtMeeting {...systemIntake} />
                  {/* 5. Submit your Business Case for final approval */}
                  <GovTaskBizCaseFinal {...systemIntake} />
                  {/* 6. Attend the GRB meeting */}
                  <GovTaskGrbMeeting {...systemIntake} />
                  {/* 7. Decision and next steps */}
                  <GovTaskDecisionAndNextSteps {...systemIntake} />
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
        )}
      </GridContainer>
    </MainContent>
  );
}

export default GovernanceTaskList;
