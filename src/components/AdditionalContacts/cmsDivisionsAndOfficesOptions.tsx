import React from 'react';

import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';

const cmsDivisionsAndOfficesOptions = (fieldId: string) => {
  return cmsDivisionsAndOffices.map(
    (office: { acronym: string; name: string }) => (
      <option key={`${fieldId}-${office.acronym}`} value={office.name}>
        {office.acronym ? `${office.name} (${office.acronym})` : office.name}
      </option>
    )
  );
};

export default cmsDivisionsAndOfficesOptions;
