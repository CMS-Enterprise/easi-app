import React from 'react';

import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import { CedarContactProps } from 'types/systemIntake';

export const getContactByEUA = (
  contacts: CedarContactProps[],
  euaUserId: string
): CedarContactProps | null => {
  const contact = contacts.find(person => person.euaUserId === euaUserId);
  return contact ?? null;
};

export const cmsDivionsAndOfficesOptions = (fieldId: string) => {
  return cmsDivisionsAndOffices.map(
    (office: { acronym: string; name: string }) => (
      <option key={`${fieldId}-${office.acronym}`} value={office.name}>
        {office.acronym ? `${office.name} (${office.acronym})` : office.name}
      </option>
    )
  );
};
