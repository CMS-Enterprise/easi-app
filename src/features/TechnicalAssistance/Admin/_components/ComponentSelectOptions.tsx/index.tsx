import React from 'react';
import { useTranslation } from 'react-i18next';

import { getNonLegacyComponents } from 'constants/cmsComponentsMap';

const ComponentSelectOptions = () => {
  const { t } = useTranslation('intake');

  return (
    <>
      {getNonLegacyComponents().map(
        ({ labelKey, acronym, enum: enumValue }) => {
          const label = t(labelKey);
          return (
            <option key={enumValue} value={label}>
              {acronym ? `${label} (${acronym})` : label}
            </option>
          );
        }
      )}
    </>
  );
};

export default ComponentSelectOptions;
