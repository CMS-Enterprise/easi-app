import React from 'react';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';
import { startCase } from 'lodash';

import {
  GetSystemProfileATO,
  GetSystemProfileRoles
} from 'types/systemProfile';
import { formatDateUtc } from 'utils/date';
import showVal from 'utils/showVal';

/**
 * Get a person's full name from a Cedar Role.
 * Format the name in title case if the full name is in all caps.
 */
export function getPersonFullName(
  role: // eslint-disable-next-line camelcase
  | GetSystemProfileRoles
    // eslint-disable-next-line camelcase
    | SystemIntakeFragmentFragment['systems'][number]['businessOwnerRoles'][number]
): string {
  const fullname = `${role.assigneeFirstName} ${role.assigneeLastName}`;
  return fullname === fullname.toUpperCase()
    ? startCase(fullname.toLowerCase())
    : fullname;
}

export function showAtoExpirationDate(
  dateAuthorizationMemoExpires?: GetSystemProfileATO['dateAuthorizationMemoExpires']
): React.ReactNode {
  return showVal(
    dateAuthorizationMemoExpires &&
      formatDateUtc(dateAuthorizationMemoExpires, 'MMMM d, yyyy')
  );
}

// TODO: combine this and above into one? showAtoDate? showDate?
export function showAtoEffectiveDate(
  // eslint-disable-next-line camelcase
  systemProfileAto?: GetSystemProfileATO
): React.ReactNode {
  return showVal(
    systemProfileAto?.dateAuthorizationMemoSigned &&
      formatDateUtc(
        systemProfileAto.dateAuthorizationMemoSigned,
        'MMMM d, yyyy'
      )
  );
}
