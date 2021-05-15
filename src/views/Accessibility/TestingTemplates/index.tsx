import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';

const TestingTemplates = () => {
  const { t } = useTranslation('accessibility');
  const vpatConformanceLevels: { name: string; description: string }[] = t(
    'testingTemplates.vpatSection.subSection.item1.levels',
    {
      returnObjects: true
    }
  );

  return (
    <div className="grid-container">
      <div className="tablet:grid-col-10">
        <PageHeading>{t('testingTemplates.heading')}</PageHeading>
        <h2>{t('testingTemplates.vpatSection.heading')}</h2>
        <p>{t('testingTemplates.vpatSection.description')}</p>
        <h3>{t('testingTemplates.vpatSection.subSection.heading')}</h3>
        <ul>
          <li>{t('testingTemplates.vpatSection.subSection.item1.text')}</li>
          {vpatConformanceLevels.map(level => (
            <p>
              <span className="text-bold">{level.name}</span>{' '}
              {level.description}
            </p>
          ))}
          <li>{t('testingTemplates.vpatSection.subSection.item2.text')}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestingTemplates;
