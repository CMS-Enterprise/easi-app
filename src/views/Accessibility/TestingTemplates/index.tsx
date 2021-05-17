import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

import './index.scss';

const TestingTemplates = () => {
  const { t } = useTranslation('accessibility');
  const vpatConformanceLevels: { name: string; description: string }[] = t(
    'testingTemplates.vpatSection.subSection.item1.levels',
    {
      returnObjects: true
    }
  );
  const testPlanList: string[] = t(
    'testingTemplates.testPlanSection.itemsToProvide',
    {
      returnObjects: true
    }
  );

  const remediationPlanList: string[] = t(
    'testingTemplates.remediationPlanSection.itemsToProvide',
    {
      returnObjects: true
    }
  );

  return (
    <div className="grid-container accessibility-testing-templates">
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
        <div className="accessibility-testing-templates__downloadBox">
          <h3>
            {t('testingTemplates.vpatSection.subSection.downloadVPAT.heading')}
          </h3>
          <p>
            <Link href="https://www.itic.org/policy/accessibility/vpat">
              {t(
                'testingTemplates.vpatSection.subSection.downloadVPAT.line1.linkText'
              )}
            </Link>
            {` `}
            {t(
              'testingTemplates.vpatSection.subSection.downloadVPAT.line1.otherText'
            )}
          </p>
          <p>
            {t(
              'testingTemplates.vpatSection.subSection.downloadVPAT.line2.text'
            )}
          </p>
          <p>
            <Link href="https://www.youtube.com/watch?v=kAkSV9xiJ1A">
              {t(
                'testingTemplates.vpatSection.subSection.downloadVPAT.line3.linkText'
              )}
            </Link>
            {` `}
            {t(
              'testingTemplates.vpatSection.subSection.downloadVPAT.line3.otherText'
            )}
          </p>
        </div>
        <div>
          <h2>{t('testingTemplates.testPlanSection.heading')}</h2>
          <p>{t('testingTemplates.testPlanSection.description')}</p>
          <ul>
            {testPlanList.map(item => (
              <li>{item}</li>
            ))}
          </ul>
          <h2>{t('testingTemplates.testPlanSection.heading')}</h2>
          <p>{t('testingTemplates.testPlanSection.description')}</p>
          <ul>
            {testPlanList.map(item => (
              <li>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{t('testingTemplates.remediationPlanSection.heading')}</h2>
          <p>{t('testingTemplates.remediationPlanSection.description')}</p>
          <ul>
            {remediationPlanList.map(item => (
              <li>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestingTemplates;
