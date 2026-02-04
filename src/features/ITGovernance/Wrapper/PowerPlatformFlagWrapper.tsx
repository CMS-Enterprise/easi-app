import React from 'react';
import { useParams } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';

export default function PowerPlatformFlagWrapper({
  children
}: React.PropsWithChildren) {
  const { systemIntakeID } = useParams<{ systemIntakeID?: string }>();
  const flags = useFlags();

  if (flags.enablePowerPlatform) {
    window.location.href = `https://icpg-dev.crm9.dynamics.com/main.aspx?appid=bc878d88-0468-f011-bec2-001dd8062d4a&pagetype=entityrecord&etn=new_systemintake&id=${systemIntakeID}`;
    return null;
  }

  return <>{children}</>;
}
