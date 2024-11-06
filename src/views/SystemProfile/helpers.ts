import React from 'react';
import { startCase } from 'lodash';

// eslint-disable-next-line camelcase
import { GetSystemIntake_systemIntake_systems_businessOwnerRoles } from 'queries/types/GetSystemIntake';
import {
  GetSystemProfile_cedarAuthorityToOperate as CedarAuthorityToOperate,
  /* eslint-disable camelcase */
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
  dateAuthorizationMemoExpires?: CedarAuthorityToOperate['dateAuthorizationMemoExpires']
): React.ReactNode {
  return showVal(
    dateAuthorizationMemoExpires &&
      formatDateUtc(dateAuthorizationMemoExpires, 'MMMM d, yyyy')
  );
}

// TODO: combine this and above into one? showAtoDate? showDate?
export function showAtoEffectiveDate(
  // eslint-disable-next-line camelcase
  systemProfileAto?: CedarAuthorityToOperate
): React.ReactNode {
  return showVal(
    systemProfileAto?.dateAuthorizationMemoSigned &&
      formatDateUtc(
        systemProfileAto.dateAuthorizationMemoSigned,
        'MMMM d, yyyy'
      )
  );
}
