import React from 'react';

import {
  /* eslint-disable camelcase */
  GetSystemProfile_cedarAuthorityToOperate
  /* eslint-enable camelcase */
} from 'queries/types/GetSystemProfile';
import { formatDateUtc } from 'utils/date';
import showVal from 'utils/showVal';

// eslint-disable-next-line import/prefer-default-export
export function showAtoExpirationDate(
  // eslint-disable-next-line camelcase
  systemProfileAto?: GetSystemProfile_cedarAuthorityToOperate
): React.ReactNode {
  return showVal(
    systemProfileAto?.dateAuthorizationMemoExpires &&
      formatDateUtc(
        systemProfileAto.dateAuthorizationMemoExpires,
        'MMMM d, yyyy'
      )
  );
}
