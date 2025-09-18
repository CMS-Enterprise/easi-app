import React from 'react';

import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';

// Creates CMS Divisions and Offices options for intake select fields
const cmsDivisionsAndOfficesOptions = (fieldId: string) => {
  return cmsDivisionsAndOffices
    .filter(val => !val.legacy)
    .map(({ acronym, name, enum: enumValue }) => (
      <option key={`${fieldId}-${enumValue}`} value={name}>
        {acronym ? `${name} (${acronym})` : name}
      </option>
    ));
};

export default cmsDivisionsAndOfficesOptions;
