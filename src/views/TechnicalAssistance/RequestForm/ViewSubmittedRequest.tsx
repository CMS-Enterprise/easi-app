import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { GetTrbRequest_trbRequest as TrbRequest } from 'queries/types/GetTrbRequest';

import SubmittedRequest from './SubmittedRequest';

function ViewSubmittedRequest({
  request,
  breadcrumbBar,
  taskListUrl
}: {
  request: TrbRequest;
  breadcrumbBar: React.ReactNode;
  taskListUrl: string;
}) {
  const { t } = useTranslation('technicalAssistance');
  return (
    <GridContainer className="width-full">
      {breadcrumbBar}

      <PageHeading className="margin-top-6 margin-bottom-4">
        {t('viewSubmitted.heading')}
      </PageHeading>

      <UswdsReactLink
        variant="unstyled"
        className="usa-button usa-button--outline"
        to={taskListUrl}
      >
        {t('done.returnToTaskList')}
      </UswdsReactLink>

      <SubmittedRequest request={request} />
    </GridContainer>
  );
}

export default ViewSubmittedRequest;
