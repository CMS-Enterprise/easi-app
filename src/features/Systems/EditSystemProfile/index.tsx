import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CardGroup, GridContainer, Icon } from '@trussworks/react-uswds';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import Breadcrumbs from 'components/Breadcrumbs';
import IconLink from 'components/IconLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import SystemProfileSectionCard from './_components/SystemProfileSectionCard';

const EditSystemProfile = () => {
  const { t } = useTranslation('systemProfile');

  const { systemId } = useParams<{
    systemId: string;
  }>();

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
            // TODO: use system name from query
            systemName: 'Easy Access to System Information'
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
            title={t('businessInformation.title')}
            description={t('businessInformation.description')}
            section={SystemProfileLockableSection.BUSINESS_INFORMATION}
            percentComplete={18}
            isManagedExternally
          />

          <SystemProfileSectionCard
            title={t('implementationDetails.title')}
            description={t('implementationDetails.description')}
            section={SystemProfileLockableSection.IMPLEMENTATION_DETAILS}
            percentComplete={98}
          />

          <SystemProfileSectionCard
            title={t('data.title')}
            description={t('data.description')}
            section={SystemProfileLockableSection.DATA}
            percentComplete={70}
          />

          <SystemProfileSectionCard
            title={t('toolsAndSoftware.title')}
            description={t('toolsAndSoftware.description')}
            section={SystemProfileLockableSection.TOOLS_AND_SOFTWARE}
            percentComplete={70}
          />

          <SystemProfileSectionCard
            title={t('subSystems.title')}
            description={t('subSystems.description')}
            section={SystemProfileLockableSection.SUB_SYSTEMS}
            percentComplete={70}
          />

          <SystemProfileSectionCard
            title={t('team.title')}
            description={t('team.description')}
            section={SystemProfileLockableSection.TEAM}
            percentComplete={70}
          />

          <SystemProfileSectionCard
            title={t('contracts.title')}
            description={t('contracts.description')}
            section="CONTRACTS"
            isManagedExternally
            externalDataExists
            readOnly
          />

          <SystemProfileSectionCard
            title={t('fundingAndBudget.title')}
            description={t('fundingAndBudget.description')}
            section="FUNDING_AND_BUDGET"
            isManagedExternally
            externalDataExists
            readOnly
          />

          <SystemProfileSectionCard
            title={t('atoAndSecurity.title')}
            description={t('atoAndSecurity.description')}
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
