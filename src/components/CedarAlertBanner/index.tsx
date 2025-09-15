import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { GridContainer, Link } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';

const CedarAlertBanner = () => {
  const { authState } = useOktaAuth();

  const flags = useFlags();

  if (!authState?.isAuthenticated || !flags.serviceAlertEnabled) {
    return null;
  }

  return (
    <div className="usa-alert--warning">
      <MainContent className="padding-bottom-0">
        <GridContainer className="padding-x-105">
          <Alert type="warning" className="border-none">
            Data sources that EASi uses for system information are transitioning
            to a new platform. EASi may be temporarily impacted by these
            changes. Please contact{' '}
            <Link href="mailto:EnterpriseArchitecture@cms.hhs.gov">
              EnterpriseArchitecture@cms.hhs.gov
            </Link>{' '}
            or{' '}
            <UswdsReactLink to="/help/report-a-problem" target="_blank">
              report a problem through EASi
            </UswdsReactLink>{' '}
            if you experience any issues.
          </Alert>{' '}
        </GridContainer>
      </MainContent>
    </div>
  );
};

export default CedarAlertBanner;
