import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Icon
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
      className="easi-governance-overview grid-container margin-bottom-2"
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
      <PageHeading className="margin-bottom-2">{t('heading')}</PageHeading>
      <Link
        to={{
          pathname: `/system/request-type/${systemId || ''}`,
          search: linkCedarSystemIdQs,
          state: { isNew }
        }}
        className="display-flex flex-align-center text-primary"
      >
        <Icon.NavigateBefore className="text-no-underline" aria-hidden />
        <span>{t('intake:navigation.changeRequestType')}</span>
      </Link>
      <p className="line-height-body-5 font-body-lg text-light">
        {t('subheading')}
      </p>
      <p className="easi-governance-overview__indented-body">
        {t('processUse')}
      </p>

      <GovernanceOverviewContent />

      {systemId && (
        <UswdsReactLink
          className="usa-button margin-bottom-5"
          variant="unstyled"
          to={{
            pathname: `/system/link/${systemId}`,
            search: linkCedarSystemIdQs,
            state: { isNew }
          }}
        >
          {t('getStarted')}
        </UswdsReactLink>
      )}
    </MainContent>
  );
};

export default GovernanceOverview;
