import React from 'react';
import { useParams } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';

function powerPlatformLink(id: string): string {
  switch (import.meta.env.NODE_ENV) {
    case 'production':
      return `https://itgovernance.crm9.dynamics.com/main.aspx?appid=941458af-d8eb-f011-8544-001dd80f20e8&id=${id}`;
    case 'development':
      return `https://itgovernancedev.crm9.dynamics.com/main.aspx?appid=110e68fa-41bf-4a23-a577-e58b353d60c7&id=${id}`;
    default:
      return '';
  }
}

export default function PowerPlatformFlagWrapper({
  children
}: React.PropsWithChildren) {
  const { intakeId } = useParams<{ intakeId: string }>();
  const flags = useFlags();

  if (flags.enablePowerPlatform) {
    const link = powerPlatformLink(intakeId);
    if (link.length < 1) {
      // if we fail to resolve a link, proceed as normal
      return <>{children}</>;
    }

    window.location.href = link;
    return <PageLoading />;
  }

  return <>{children}</>;
}
