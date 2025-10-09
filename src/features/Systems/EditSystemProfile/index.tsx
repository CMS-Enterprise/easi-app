import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CardGroup, GridContainer, Icon } from '@trussworks/react-uswds';

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

        <CardGroup>
          <SystemProfileSectionCard
            title={t('businessInformation.title')}
            description={t('businessInformation.description')}
            route="business-information"
            isManagedExternally
          />
        </CardGroup>
      </GridContainer>
    </MainContent>
  );
};

export default EditSystemProfile;
