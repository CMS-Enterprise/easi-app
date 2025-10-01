import React from 'react';

import cmsComponentsMap from 'constants/cmsComponentsMap';

const ComponentSelectOptions = () => (
  <>
    {Object.values(cmsComponentsMap)
      .filter(val => !val.legacy)
      .map(({ acronym, name }) => (
        <option key={name} value={name}>
          {acronym ? `${name} (${acronym})` : name}
        </option>
      ))}
  </>
);

export default ComponentSelectOptions;
