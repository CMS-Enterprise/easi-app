import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';
import IconLink from 'components/shared/IconLink';
import GetGovernanceRequestFeedbackQuery from 'queries/GetGovernanceRequestFeedbackQuery';
import {
  GetGovernanceRequestFeedback,
  GetGovernanceRequestFeedbackVariables
} from 'queries/types/GetGovernanceRequestFeedback';
import { GovernanceRequestFeedbackTargetForm } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';

const GovernanceFeedback = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('taskList');
  const { data } = useQuery<
    GetGovernanceRequestFeedback,
    GetGovernanceRequestFeedbackVariables
  >(GetGovernanceRequestFeedbackQuery, {
    variables: {
      intakeID: systemId
    }
  });

  const feedback = data?.systemIntake?.governanceRequestFeedbacks || [];

  return (
    <MainContent className="grid-container padding-bottom-10 margin-bottom-2">
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{t('navigation.home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink
            asCustom={Link}
            to={`/governance-task-list/${systemId}`}
          >
            <span>{t('navigation.governanceTaskList')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('navigation.feedback')}</Breadcrumb>
      </BreadcrumbBar>

      <PageHeading className="margin-top-4 margin-bottom-105">
        {t('feedbackV2.heading')}
      </PageHeading>

      <IconLink
        to={`/governance-task-list/${systemId}`}
        icon={<IconArrowBack />}
      >
        {t('feedbackV2.returnToRequest')}
      </IconLink>

      <ul className="usa-list--unstyled margin-top-4">
        {feedback.map(item => {
          return (
            <li className="border-top-1px border-base-light margin-bottom-4">
              <h3 className="margin-top-4">
                {item.targetForm !==
                GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED
                  ? t('feedbackV2.feedbackTitleEditsRequested')
                  : t('feedbackV2.feedbackTitle', { context: item.type })}
              </h3>

              <dl className="grid-row">
                <Grid col={6}>
                  <dt className="text-bold margin-bottom-1">
                    {t('feedbackV2.date')}
                  </dt>
                  <dd className="margin-x-0">
                    {formatDateLocal(item.createdAt, 'MMMM d, yyyy')}
                  </dd>
                </Grid>
                <Grid col={6}>
                  <dt className="text-bold margin-bottom-1">
                    {t('feedbackV2.from')}
                  </dt>
                  <dd className="margin-x-0">
                    {t('feedbackV2.author', { name: item.author.commonName })}
                  </dd>
                </Grid>
                <div className="bg-base-lightest width-full margin-top-3 padding-3">
                  {item.targetForm !==
                    GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED && (
                    <dl className="margin-y-0">
                      <dt className="text-bold margin-top-0 margin-bottom-1">
                        {t('feedbackV2.editsRequestedFor')}
                      </dt>
                      <dd className="margin-top-1 margin-bottom-4 margin-x-0">
                        {t(`feedbackV2.targetForm.${item.targetForm}`)}
                      </dd>
                    </dl>
                  )}
                  <p className="margin-y-0">{item.feedback}</p>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>

      <Divider className="margin-bottom-4" />

      <IconLink
        to={`/governance-task-list/${systemId}`}
        icon={<IconArrowBack />}
      >
        {t('feedbackV2.returnToRequest')}
      </IconLink>
    </MainContent>
  );
};

export default GovernanceFeedback;
