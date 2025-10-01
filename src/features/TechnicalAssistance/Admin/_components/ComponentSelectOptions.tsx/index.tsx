import React from 'react';
import { useTranslation } from 'react-i18next';

import cmsComponentsMap from 'constants/cmsComponentsMap';

const ComponentSelectOptions = () => {
  const { t } = useTranslation('intake');

  return (
    <>
      {Object.values(cmsComponentsMap)
        .filter(val => !val.legacy)
        .map(({ acronym, labelKey }) => (
          <option key={labelKey} value={t(labelKey)}>
            {acronym ? `${t(labelKey)} (${acronym})` : t(labelKey)}
          </option>
        ))}
    </>
  );
};

export default ComponentSelectOptions;
