import React from 'react';

import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';

const ComponentSelectOptions = () => (
  <>
    {cmsDivisionsAndOffices
      .filter(val => !val.legacy)
      .map(({ acronym, name }) => (
        <option key={name} value={name}>
          {acronym ? `${name} (${acronym})` : name}
        </option>
      ))}
  </>
);

export default ComponentSelectOptions;
