import React from 'react';
import { RouteComponentProps, useLocation, withRouter } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';

function powerPlatformLink(id?: string): string {
  let env: string = process.env.NODE_ENV || '';
  if (import.meta?.env?.NODE_ENV?.length > 0) {
    env = import.meta.env.NODE_ENV;
  }

  if (env.length < 1) {
    return '';
  }

  let idSuffix = '';
  if (id) {
    idSuffix = `&id=${id}`;
  }

  // return `https://itgovernancedev.crm9.dynamics.com/main.aspx?appid=110e68fa-41bf-4a23-a577-e58b353d60c7&id=${id}`;
  switch (env) {
    case 'production':
      return `https://itgovernance.crm9.dynamics.com/main.aspx?appid=941458af-d8eb-f011-8544-001dd80f20e8${idSuffix}`;

    // send local and dev to same spot
    case 'development':
      return `https://itgovernancedev.crm9.dynamics.com/main.aspx?appid=110e68fa-41bf-4a23-a577-e58b353d60c7${idSuffix}`;
    default:
      return '';
  }
}

interface params {
  intakeId: string;
}

function PowerPlatformFlagWrapper({ match }: RouteComponentProps<params>) {
  const { intakeId } = match.params;
  const flags = useFlags();
  const location = useLocation();

  const shouldRedirect =
    intakeId.length > 0 || location.pathname === '/system/request-type';

  if (flags.enablePowerPlatform && shouldRedirect) {
    const link = powerPlatformLink(intakeId.length > 0 ? intakeId : undefined);
    if (link.length > 0) {
      window.location.href = link;
      return <PageLoading />;
    }
  }

  return null;
}

export default withRouter(PowerPlatformFlagWrapper);
