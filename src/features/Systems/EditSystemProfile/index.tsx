import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CardGroup, GridContainer, Icon } from '@trussworks/react-uswds';
import NotFound from 'features/Miscellaneous/NotFound';
import {
  SystemProfileLockableSection,
  useGetCedarSystemQuery
} from 'gql/generated/graphql';

import Breadcrumbs from 'components/Breadcrumbs';
import IconLink from 'components/IconLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';

import SystemProfileSectionCard from './_components/SystemProfileSectionCard';

/**
 * Displays section cards and links for editing system profile.
 */
const EditSystemProfile = () => {
  const { t } = useTranslation('systemProfile');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { data, loading } = useGetCedarSystemQuery({
    variables: {
      id: systemId
    }
  });

  if (!data) return <NotFound />;

  if (loading) return <PageLoading />;

  const { name: systemName } = data.cedarSystem || {};

  return (
    <MainContent>
      <GridContainer>
        <Breadcrumbs
          items={[
            { text: t('header:home'), url: '/' },
            {
              text: t('systemWorkspace:header'),
              url: `/systems/${systemId}/workspace`
            },
            { text: t('systemProfile:editSystemProfile.heading') }
          ]}
        />

        <PageHeading className="margin-bottom-0">
          {t('systemProfile:editSystemProfile.heading')}
        </PageHeading>

        <p className="text-body-lg text-light margin-top-1">
          {t('systemProfile:editSystemProfile.subheading', {
            systemName
          })}
        </p>

        <p className="font-body-md text-light line-height-body-5 margin-top-105">
          {t('systemProfile:editSystemProfile.description')}
        </p>

        <IconLink
          to={`/systems/${systemId}/workspace`}
          icon={<Icon.ArrowBack aria-hidden />}
          iconPosition="before"
          className="margin-bottom-6"
        >
          {t('systemProfile:editSystemProfile.returnToSystemWorkspace')}
        </IconLink>

        <CardGroup className="margin-bottom-10">
          <SystemProfileSectionCard
            section={SystemProfileLockableSection.BUSINESS_INFORMATION}
            percentComplete={18}
            isManagedExternally
            hasPendingChanges
          />

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.IMPLEMENTATION_DETAILS}
            percentComplete={98}
          />

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.DATA}
            percentComplete={70}
          />

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.TOOLS_AND_SOFTWARE}
            percentComplete={70}
          />

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.SUB_SYSTEMS}
            percentComplete={70}
          />

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.TEAM}
            percentComplete={70}
          />

          <SystemProfileSectionCard
            section="CONTRACTS"
            isManagedExternally
            externalDataExists
            readOnly
          />

          <SystemProfileSectionCard
            section="FUNDING_AND_BUDGET"
            isManagedExternally
            externalDataExists
            readOnly
          />

          <SystemProfileSectionCard
            section="ATO_AND_SECURITY"
            isManagedExternally
            externalDataExists
            readOnly
          />
        </CardGroup>
      </GridContainer>
    </MainContent>
  );
};

export default EditSystemProfile;
