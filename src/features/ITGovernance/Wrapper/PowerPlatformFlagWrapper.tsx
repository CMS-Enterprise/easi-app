import React from 'react';
import { useParams } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';

export default function PowerPlatformFlagWrapper({
  children
}: React.PropsWithChildren) {
  const { id } = useParams<{ id?: string }>();
  const flags = useFlags();

  if (flags.enablePowerPlatform) {
    window.location.href = `https://icpg-dev.crm9.dynamics.com/main.aspx?appid=bc878d88-0468-f011-bec2-001dd8062d4a&pagetype=entityrecord&etn=new_systemintake&id=${id}`;
    return <PageLoading />;
  }

  return <>{children}</>;
}
