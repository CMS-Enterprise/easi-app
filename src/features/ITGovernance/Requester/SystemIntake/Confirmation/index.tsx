import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as ReactRouterLink, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  GridContainer,
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import ExternalLinkAndModal from 'components/ExternalLinkAndModal';
import PageHeading from 'components/PageHeading';

const Confirmation = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('intake');

  return (
    <>
      <div className="margin-bottom-8 bg-success-lighter padding-bottom-6">
        <GridContainer>
          <BreadcrumbBar
            variant="wrap"
            className="bg-success-lighter margin-bottom-6"
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
            {t('submission.success.heading')}
          </PageHeading>
          <p className="font-body-lg line-height-body-5 margin-top-0 margin-bottom-5">
            {t('submission.success.description')}
          </p>
          <Link
            href={`/governance-task-list/${systemId}`}
            className="usa-button"
            variant="unstyled"
          >
            {t('taskList:navigation.returnToTaskList')}
          </Link>
        </GridContainer>
      </div>
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

          {/* <div>
        <PageHeading>{t('submission.confirmation.heading')}</PageHeading>
        <h2 className="margin-bottom-8 text-normal">
          {t('submission.confirmation.subheading', {
            referenceId: systemId
          })}
        </h2>
        <div>
          <Link
            to={`/governance-task-list/${systemId}`}
            className="display-flex"
          >
            <Icon.NavigateBefore className="margin-x-05" aria-hidden />
            {t('submission.confirmation.taskListCta')}
          </Link>
        </div>
      </div> */}
        </GridContainer>
      </div>
    </>
  );
};

export default Confirmation;
