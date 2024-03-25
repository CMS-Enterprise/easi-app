import React from 'react';
import { startCase } from 'lodash';

// eslint-disable-next-line camelcase
import { GetSystemIntake_systemIntake_systems_businessOwnerRoles } from 'queries/types/GetSystemIntake';
import {
  /* eslint-disable camelcase */
  GetSystemProfile_cedarAuthorityToOperate,
  GetSystemProfile_cedarSystemDetails_roles
  /* eslint-enable camelcase */
} from 'queries/types/GetSystemProfile';
import { formatDateUtc } from 'utils/date';
import showVal from 'utils/showVal';

/**
 * Get a person's full name from a Cedar Role.
 * Format the name in title case if the full name is in all caps.
 */
export function getPersonFullName(
  role: // eslint-disable-next-line camelcase
  | GetSystemProfile_cedarSystemDetails_roles
    // eslint-disable-next-line camelcase
    | GetSystemIntake_systemIntake_systems_businessOwnerRoles
): string {
  const fullname = `${role.assigneeFirstName} ${role.assigneeLastName}`;
  return fullname === fullname.toUpperCase()
    ? startCase(fullname.toLowerCase())
    : fullname;
}

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
