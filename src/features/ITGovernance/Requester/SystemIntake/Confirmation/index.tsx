import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

const Confirmation = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('intake');

  return (
    <div className="margin-bottom-15">
      <PageHeading className="margin-top-4 margin-bottom-1">
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

      <SummaryBox className="grid-col-8 margin-top-8 margin-bottom-5">
        <SummaryBoxHeading headingLevel="h3" className="margin-bottom-2">
          {t('review.nextSteps.heading')}
        </SummaryBoxHeading>
        <SummaryBoxContent>
          {t('review.nextSteps.description')}
        </SummaryBoxContent>
      </SummaryBox>

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
    </div>
  );
};

export default Confirmation;
