import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, GridContainer, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

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

  const history = useHistory();
  const newTab = history.length === 1;

  return (
    <GridContainer className="width-full">
      {!newTab && breadcrumbBar}

      {newTab && (
        <Button
          type="button"
          unstyled
          onClick={() => window.close()}
          className="margin-top-6"
        >
          <Icon.Close className="margin-right-05 text-tbottom" />
          {t('closeTab')}
        </Button>
      )}

      <PageHeading
        className={classNames('margin-bottom-4', {
          'margin-top-6': !newTab,
          'margin-top-4': newTab
        })}
      >
        {t('viewSubmitted.heading')}
      </PageHeading>

      {!newTab && (
        <UswdsReactLink
          variant="unstyled"
          className="usa-button usa-button--outline"
          to={taskListUrl}
        >
          {t('done.returnToTaskList')}
        </UswdsReactLink>
      )}

      <SubmittedRequest request={request} showRequestHeaderInfo />
    </GridContainer>
  );
}

export default ViewSubmittedRequest;
