import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import FeedbackList from './FeedbackList';

/**
 * IT Governance feedback page
 */
const GovernanceFeedback = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('taskList');

  const { state } = useLocation<{
    form?: { pathname: string; type: string };
  }>();

  /** form pathname and type if user navigated from form feedback banner */
  const formState = state?.form;

  /**
   * Breadcrumb links
   *
   * Includes form link if navigating from intake or Business Case form
   */
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

  return (
    <MainContent className="grid-container padding-bottom-10 margin-bottom-2">
      <BreadcrumbBar variant="wrap">
        <BreadcrumbLinks />
      </BreadcrumbBar>

      <PageHeading className="margin-top-4 margin-bottom-105">
        {t('feedbackV2.heading')}
      </PageHeading>

      <FeedbackList
        systemIntakeId={systemId}
        returnLink={{
          path: formState?.pathname || `/governance-task-list/${systemId}`,
          text: formState
            ? t('navigation.returnToForm', { type: formState.type })
            : t('navigation.returnToGovernanceTaskList')
        }}
      />
    </MainContent>
  );
};

export default GovernanceFeedback;
