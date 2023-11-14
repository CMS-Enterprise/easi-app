import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  IconArrowBack,
  IconFileDownload
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Divider from 'components/shared/Divider';
import IconButton from 'components/shared/IconButton';
import IconLink from 'components/shared/IconLink';
import GetGovernanceRequestFeedbackQuery from 'queries/GetGovernanceRequestFeedbackQuery';
import {
  GetGovernanceRequestFeedback,
  GetGovernanceRequestFeedbackVariables
} from 'queries/types/GetGovernanceRequestFeedback';

import FeedbackItem from './FeedbackItem';

const GovernanceFeedback = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('taskList');

  const { state } = useLocation<{
    form?: { pathname: string; type: string };
  }>();

  /** form pathname and type if user navigated from form feedback banner */
  const formState = state?.form;

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: 'Feedback',
    content: () => printRef.current,
    pageStyle: `
      @page {
        margin: auto;
      }
    `
  });

  const { data, loading } = useQuery<
    GetGovernanceRequestFeedback,
    GetGovernanceRequestFeedbackVariables
  >(GetGovernanceRequestFeedbackQuery, {
    variables: {
      intakeID: systemId
    }
  });

  const feedback = data?.systemIntake?.governanceRequestFeedbacks || [];

  /** Return to request and PDF download links */
  const ActionLinks = () => (
    <div className="easi-no-print tablet:display-flex">
      <IconLink
        to={formState?.pathname || `/governance-task-list/${systemId}`}
        icon={<IconArrowBack />}
        className="margin-bottom-1 tablet:margin-bottom-0"
      >
        {formState
          ? t('navigation.returnToForm', { type: formState.type })
          : t('navigation.returnToGovernanceTaskList')}
      </IconLink>
      <span className="margin-x-2 text-base-light display-none tablet:display-block">
        |
      </span>
      <IconButton
        type="button"
        onClick={handlePrint}
        icon={<IconFileDownload />}
        unstyled
      >
        {t('feedbackV2.downloadAsPDF')}
      </IconButton>
    </div>
  );

  const BreadcrumbLinks = () => {
    return (
      <>
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
        {formState && (
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to={formState.pathname}>
              <span>{t(formState.type)}</span>
            </BreadcrumbLink>
          </Breadcrumb>
        )}
        <Breadcrumb current>{t('navigation.feedback')}</Breadcrumb>
      </>
    );
  };

  if (loading) return <PageLoading />;

  return (
    <MainContent className="grid-container padding-bottom-10 margin-bottom-2">
      <BreadcrumbBar variant="wrap">
        <BreadcrumbLinks />
      </BreadcrumbBar>

      <div ref={printRef}>
        <PageHeading className="margin-top-4 margin-bottom-105">
          {t('feedbackV2.heading')}
        </PageHeading>

        <ActionLinks />

        <ul
          className="usa-list--unstyled margin-top-4"
          data-testid="feedback-list"
        >
          {feedback.map(item => (
            <FeedbackItem key={item.id} {...item} />
          ))}
        </ul>
      </div>

      <Divider className="margin-bottom-4" />

      <ActionLinks />
    </MainContent>
  );
};

export default GovernanceFeedback;
