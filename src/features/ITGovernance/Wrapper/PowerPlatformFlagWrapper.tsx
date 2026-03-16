import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';

function powerPlatformLink(id: string): string {
  // return `https://itgovernancedev.crm9.dynamics.com/main.aspx?appid=110e68fa-41bf-4a23-a577-e58b353d60c7&id=${id}`;
  switch (import.meta.env.NODE_ENV) {
    case 'production':
      return `https://itgovernance.crm9.dynamics.com/main.aspx?appid=941458af-d8eb-f011-8544-001dd80f20e8&id=${id}`;

    // send local and dev to same spot
    case 'development':
    case 'local':
      return `https://itgovernancedev.crm9.dynamics.com/main.aspx?appid=110e68fa-41bf-4a23-a577-e58b353d60c7&id=${id}`;
    default:
      return '';
  }
}

interface params {
  intakeId: string;
}

function PowerPlatformFlagWrapper({ match }: RouteComponentProps<params>) {
  console.info('in power platform wrapper');
  const { intakeId } = match.params;
  const flags = useFlags();

  if (flags.enablePowerPlatform && intakeId.length > 0) {
    const link = powerPlatformLink(intakeId);
    console.info(link);
    if (link.length > 0) {
      window.location.href = link;
      return <PageLoading />;
    }
  }

  return null;
}

export default withRouter(PowerPlatformFlagWrapper);
