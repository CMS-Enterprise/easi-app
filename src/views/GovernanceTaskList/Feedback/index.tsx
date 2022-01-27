import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import HelpText from 'components/shared/HelpText';
import GetGRTFeedbackQuery from 'queries/GetGRTFeedbackQuery';
import {
  GetGRTFeedback,
  GetGRTFeedback_systemIntake_grtFeedbacks as GRTFeedback,
  GetGRTFeedbackVariables
} from 'queries/types/GetGRTFeedback';

const GovernanceFeedback = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('taskList');
  const { data: grtFeedbackData } = useQuery<
    GetGRTFeedback,
    GetGRTFeedbackVariables
  >(GetGRTFeedbackQuery, {
    variables: {
      intakeID: systemId
    }
  });

  const feedback = grtFeedbackData?.systemIntake?.grtFeedbacks || [];
  const feedbackforGRB = feedback.filter(
    grtFeedback => grtFeedback.feedbackType === 'GRB'
  );
  const feedbackforBusinessOwner = feedback.filter(
    grtFeedback => grtFeedback.feedbackType === 'BUSINESS_OWNER'
  );

  const formatGRTFeedback = (item: GRTFeedback) => {
    const formattedDate = DateTime.fromISO(item.createdAt).toLocaleString(
      DateTime.DATE_MED
    );
    return (
      <div className="margin-bottom-3" key={item.id}>
        <h4
          className="margin-y-0"
          aria-label={t('feedback.descriptiveDate', { date: formattedDate })}
        >
          {formattedDate}
        </h4>
        <p className="margin-top-1 line-height-body-6">{item.feedback}</p>
      </div>
    );
  };

  return (
    <MainContent>
      <div className="grid-container">
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
              <span>{t('navigation.governanceApproval')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{t('navigation.feedback')}</Breadcrumb>
        </BreadcrumbBar>
        <div className="grid-col-10">
          <PageHeading>{t('feedback.heading')}</PageHeading>
          {feedbackforGRB.length > 0 && (
            <>
              <h2>{t('feedback.grb.heading')}</h2>
              <HelpText>{t('feedback.grb.help')}</HelpText>
              <div className="margin-top-3">
                {feedbackforGRB.map(item => formatGRTFeedback(item))}
              </div>
            </>
          )}

          <h2>{t('feedback.businessOwner.heading')}</h2>
          <HelpText>{t('feedback.businessOwner.help')}</HelpText>
          <div className="margin-top-3">
            {feedbackforBusinessOwner.map(item => formatGRTFeedback(item))}
          </div>
        </div>
        <UswdsReactLink to={`/governance-task-list/${systemId}`}>
          {t('navigation.returnToTaskList')}
        </UswdsReactLink>
      </div>
    </MainContent>
  );
};

export default GovernanceFeedback;
