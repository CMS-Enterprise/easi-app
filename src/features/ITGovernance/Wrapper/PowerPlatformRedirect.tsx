import React from 'react';
import { useParams } from 'react-router-dom';

import PageLoading from 'components/PageLoading';
import powerPlatformLink from 'utils/powerPlatformLink';
import isValidUUID from 'utils/uuid';

interface params {
  intakeId: string;
}

function PowerPlatformRedirect() {
  const { intakeId } = useParams<params>();

  const validIntakeID = intakeId?.length > 0 && isValidUUID(intakeId);

  const link = powerPlatformLink(validIntakeID ? intakeId : undefined);
  if (link.length > 0) {
    window.location.href = link;
    return <PageLoading />;
  }

  return null;
}

export default PowerPlatformRedirect;
