import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as ReactRouterLink, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  ButtonGroup,
  GridContainer,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import ExternalLinkAndModal from 'components/ExternalLinkAndModal';
import PageHeading from 'components/PageHeading';

const Confirmation = ({
  submissionSuccess
}: {
  submissionSuccess: boolean;
}) => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('intake');

  return (
    <>
      <div
        className={`margin-bottom-8  padding-bottom-6 ${submissionSuccess ? 'bg-success-lighter' : 'bg-error-lighter'}`}
      >
        <GridContainer>
          <BreadcrumbBar
            variant="wrap"
            className={`margin-bottom-6 ${submissionSuccess ? 'bg-success-lighter' : 'bg-error-lighter'}`}
          >
            <Breadcrumb>
              <BreadcrumbLink asCustom={ReactRouterLink} to="/">
                <span>{t('taskList:navigation.home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={ReactRouterLink}
                to={`/governance-task-list/${systemId}`}
              >
                <span>{t('taskList:navigation.governanceTaskList')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>
              {t('taskList:navigation.intakeRequest')}
            </Breadcrumb>
          </BreadcrumbBar>

          <PageHeading className="margin-top-0 margin-bottom-1">
            {submissionSuccess
              ? t('submission.success.heading')
              : t('submission.error.heading')}
          </PageHeading>
          <p className="font-body-lg line-height-body-5 margin-top-0 margin-bottom-5">
            {submissionSuccess
              ? t('submission.success.description')
              : t('submission.error.description')}
          </p>
          <ButtonGroup>
            {!submissionSuccess && (
              <ReactRouterLink
                to={`/system/${systemId}/contact-details`}
                className="usa-button"
              >
                {t('submission.error.backToIntakeRequest')}
              </ReactRouterLink>
            )}
            <ReactRouterLink
              to={`/governance-task-list/${systemId}`}
              className={`usa-button ${!submissionSuccess ? 'usa-button--outline' : ''}`}
            >
              {t('taskList:navigation.returnToTaskList')}
            </ReactRouterLink>
          </ButtonGroup>
        </GridContainer>
      </div>
      {submissionSuccess && (
        <div>
          <GridContainer>
            <SummaryBox className="grid-col-8 margin-top-0 margin-bottom-5">
              <SummaryBoxHeading headingLevel="h3" className="margin-bottom-2">
                {t('review.nextSteps.heading')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                {t('review.nextSteps.description')}
              </SummaryBoxContent>
            </SummaryBox>
            <p>{t('submission.success.learnMore')}</p>
            <ExternalLinkAndModal
              href={t('submission.success.sharepointLink.href')}
            >
              <span>{t('submission.success.sharepointLink.copy')}</span>
            </ExternalLinkAndModal>
          </GridContainer>
        </div>
      )}
    </>
  );
};

export default Confirmation;
