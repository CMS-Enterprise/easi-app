import React from 'react';
import { RouteComponentProps, useLocation, withRouter } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';

import powerPlatformLink from '../../../utils/powerPlatformLink';

interface params {
  intakeId: string;
}

function PowerPlatformFlagWrapper({ match }: RouteComponentProps<params>) {
  const intakeId = (match && match.params && match.params.intakeId) || '';
  const flags = useFlags();
  const location = useLocation();

  const shouldRedirect =
    intakeId.length > 0 || location.pathname === '/system/request-type';

  if (flags.enablePowerPlatform && shouldRedirect) {
    const link = powerPlatformLink(intakeId.length > 0 ? intakeId : undefined);
    if (link.length > 0) {
      window.location.href = link;
      return <PageLoading fullScreen />;
    }
  }

  return null;
}

export default withRouter(PowerPlatformFlagWrapper);
