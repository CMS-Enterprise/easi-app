import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, GridContainer, IconArrowBack } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import GetLinkedRequestsQuery from 'queries/GetLinkedRequestsQuery';
import {
  GetLinkedRequests,
  GetLinkedRequestsVariables
} from 'queries/types/GetLinkedRequests';
import Table from 'views/MyRequests/Table';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

function SystemWorkspaceRequests() {
  const { t } = useTranslation('systemWorkspace');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, data } = useQuery<
    GetLinkedRequests,
    GetLinkedRequestsVariables
  >(GetLinkedRequestsQuery, {
    variables: {
      cedarSystemId: systemId
    }
  });

  return (
    <GridContainer className="width-full margin-bottom-5 desktop:margin-bottom-10">
      <Breadcrumbs
        items={[
          { text: t('breadcrumbs.home'), url: '/' },
          { text: t('header'), url: 'todo' },
          { text: t('requests.header') }
        ]}
      />

      <PageHeading className="margin-top-6 margin-bottom-05">
        {t('requests.header')}
      </PageHeading>
      <p className="font-body-lg line-height-body-5 text-light margin-y-0">
        {t('requests.subhead')}
      </p>
      <p className="line-height-body-5 margin-top-1">
        {t('requests.description')}
      </p>

      <UswdsReactLink
        to="todo"
        className="display-flex flex-align-center margin-top-2 text-primary"
      >
        <IconArrowBack className="margin-right-1" />
        {t('returnToWorkspace')}
      </UswdsReactLink>

      <div className="bg-base-lightest padding-y-3 padding-x-2 margin-top-4 margin-bottom-6">
        <h4 className="margin-top-0 margin-bottom-1">
          {t('spaces.requests.start')}
        </h4>
        <Button type="button" outline>
          {t('helpLinks.links.0.linkText')}
        </Button>
        <Button type="button" outline>
          {t('helpLinks.links.1.linkText')}
        </Button>
      </div>

      <Table />
    </GridContainer>
  );
}

export default SystemWorkspaceRequests;
