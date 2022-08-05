import React from 'react';

import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';

// Creates CMS Divisions and Offices options for intake select fields
const cmsDivisionsAndOfficesOptions = (fieldId: string) => {
  return cmsDivisionsAndOffices.map(({ acronym, name }) => (
    <option key={`${fieldId}-${acronym}`} value={name}>
      {acronym ? `${name} (${acronym})` : name}
    </option>
  ));
};

export default cmsDivisionsAndOfficesOptions;
