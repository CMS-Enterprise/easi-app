import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { GetTrbRequest_trbRequest as TrbRequest } from 'gql/legacyGQL/types/GetTrbRequest';

import IconButton from 'components/IconButton';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

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
        <IconButton
          icon={<Icon.Close />}
          type="button"
          unstyled
          onClick={() => window.close()}
          className="margin-top-6"
        >
          {t('closeTab')}
        </IconButton>
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
