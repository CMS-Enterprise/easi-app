import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import GovernanceOverviewContent from 'components/GovernanceOverview';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import linkCedarSystemIdQueryString, {
  useLinkCedarSystemIdQueryParam
} from 'utils/linkCedarSystemIdQueryString';

import './index.scss';

const GovernanceOverview = () => {
  const { t } = useTranslation('governanceOverview');
  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { state } = useLocation<{ isNew?: boolean }>();
  const isNew = !!state?.isNew;

  const linkCedarSystemId = useLinkCedarSystemIdQueryParam();
  const linkCedarSystemIdQs = linkCedarSystemIdQueryString(linkCedarSystemId);

  return (
    <MainContent
      className="easi-governance-overview grid-container margin-bottom-10"
      data-testid="governance-overview"
    >
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{t('intake:navigation.itGovernance')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('intake:navigation.startRequest')}</Breadcrumb>
      </BreadcrumbBar>

      <PageHeading className="margin-bottom-0">{t('heading')}</PageHeading>
      <span className="text-base-dark margin-right-2">
        {t('changeRequestTypeCopy')}
      </span>
      <Link
        to={{
          pathname: `/system/request-type/${systemId || ''}`,
          search: linkCedarSystemIdQs,
          state: { isNew }
        }}
        className="text-primary"
      >
        {t('intake:navigation.changeRequestType')}
      </Link>

      <p className="line-height-body-5 font-body-lg text-light">
        {t('subheading')}
      </p>

      <GovernanceOverviewContent />

      {systemId && (
        <div className="margin-top-4">
          <UswdsReactLink
            className="usa-button
            usa-button--outline"
            variant="unstyled"
            to={{
              pathname: `/system/request-type/${systemId || ''}`,
              search: linkCedarSystemIdQs,
              state: { isNew }
            }}
          >
            {t('technicalAssistance:button.back')}
          </UswdsReactLink>
          <UswdsReactLink
            className="usa-button"
            variant="unstyled"
            to={{
              pathname: `/system/link/${systemId}`,
              search: linkCedarSystemIdQs,
              state: { isNew }
            }}
          >
            {t('technicalAssistance:button.continue')}
          </UswdsReactLink>
        </div>
      )}
    </MainContent>
  );
};

export default GovernanceOverview;
