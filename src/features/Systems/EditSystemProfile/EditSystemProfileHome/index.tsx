import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup, GridContainer, Icon } from '@trussworks/react-uswds';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import Breadcrumbs from 'components/Breadcrumbs';
import IconLink from 'components/IconLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import SystemProfileSectionCard from '../_components/SystemProfileSectionCard';

type EditSystemProfileHomeProps = {
  systemId: string;
  systemName: string;
};

/**
 * Homepage for editable system profile.
 *
 * Displays cards with section information and links to view/edit.
 */
const EditSystemProfileHome = ({
  systemId,
  systemName
}: EditSystemProfileHomeProps) => {
  const { t } = useTranslation('systemProfile');

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
          {/* <SystemProfileSectionCard
            section={SystemProfileLockableSection.BUSINESS_INFORMATION}
            isManagedExternally
            readOnly
          /> */}

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.IMPLEMENTATION_DETAILS}
            isManagedExternally
            readOnly
          />

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.DATA}
            isManagedExternally
            readOnly
          />

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.TOOLS_AND_SOFTWARE}
            isManagedExternally
            readOnly
          />

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.SUB_SYSTEMS}
            isManagedExternally
            readOnly
          />

          <SystemProfileSectionCard
            section={SystemProfileLockableSection.TEAM}
          />

          <SystemProfileSectionCard
            section="CONTRACTS"
            isManagedExternally
            readOnly
          />

          <SystemProfileSectionCard
            section="FUNDING_AND_BUDGET"
            isManagedExternally
            readOnly
          />

          <SystemProfileSectionCard
            section="ATO_AND_SECURITY"
            isManagedExternally
            readOnly
          />
        </CardGroup>
      </GridContainer>
    </MainContent>
  );
};

export default EditSystemProfileHome;
