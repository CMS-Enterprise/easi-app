import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';
import powerPlatformLink from 'utils/powerPlatformLink';
import isValidUUID from 'utils/uuid';

interface params {
  intakeId: string;
}

function PowerPlatformFlagWrapper() {
  const { intakeId } = useParams<params>();
  const flags = useFlags();
  const location = useLocation();

  const shouldRedirect =
    (intakeId?.length > 0 && isValidUUID(intakeId)) ||
    location.pathname === '/system/request-type';

  if (flags.enablePowerPlatform && shouldRedirect) {
    const link = powerPlatformLink(intakeId?.length > 0 ? intakeId : undefined);
    if (link.length > 0) {
      window.location.href = link;
      return <PageLoading />;
    }
  }

  return null;
}

export default PowerPlatformFlagWrapper;
