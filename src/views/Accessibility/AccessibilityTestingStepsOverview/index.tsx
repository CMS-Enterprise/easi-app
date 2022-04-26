import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Link as UswdsLink,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import AccessibilityTestingSteps from 'components/AccessibilityTestingSteps';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import CollapsableLink from 'components/shared/CollapsableLink';

import './index.scss';

const AccessibilityTestingStepsOverview = () => {
  const { t } = useTranslation('accessibility');
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  return (
    <div className="grid-container">
      <div className="tablet:grid-col-10">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>Steps involved in 508 testing</Breadcrumb>
        </BreadcrumbBar>
        <PageHeading>{t('testingStepsOverview.heading')}</PageHeading>
        <p className="accessibility-testing-overview__description">
          {t('testingStepsOverview.description')}
        </p>
      </div>
      <AccessibilityTestingSteps />
      {params.get('continue') === 'true' && (
        <UswdsReactLink
          className="usa-button margin-top-8"
          variant="unstyled"
          to="/508/requests/new"
          data-testid="continue-link"
        >
          {t('testingStepsOverview.start')}
        </UswdsReactLink>
      )}
    </div>
  );
};

export default AccessibilityTestingStepsOverview;
