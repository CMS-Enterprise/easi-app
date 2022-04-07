import React from 'react';
import { useTranslation } from 'react-i18next';

import CollapsableList from 'components/CollapsableList';
import PageHeading from 'components/PageHeading';

import './index.scss';

type PrepareForGRTProps = {
  sidebar?: React.ReactNode;
  helpType?: string;
};

const PrepareForGRT = ({ sidebar, helpType }: PrepareForGRTProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  return (
    <>
      <div className="grid-container">
        <div className="grid-row flex-justify">
          <div className="grid-col-9">
            <PageHeading>{t('prepare.title')}</PageHeading>
            <h2 className="font-heading-xl margin-top-6">
              {t('prepare.whatToExpect.title')}
            </h2>
            {helpType && <div>{helpType}</div>}
            <ul>
              {t<string[]>('prepare.whatToExpect.items', {
                returnObjects: true
              }).map(item => (
                <li className="line-height-sans-6" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid-col-2">{sidebar}</div>
        </div>
      </div>

      <div className="distinct-content margin-top-4">
        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-10">
              <h2 className="font-heading-xl">
                {t('prepare.howToBestPrepare.title')}
              </h2>
              <p className="line-height-sans-6">
                {t('prepare.howToBestPrepare.body')}
              </p>

              <CollapsableList
                label={t('prepare.capitalPlanning.title')}
                items={t<string[]>('prepare.capitalPlanning.items', {
                  returnObjects: true
                })}
              />

              <CollapsableList
                label={t('prepare.enterpriseArchitecture.title')}
                items={t<string[]>('prepare.enterpriseArchitecture.items', {
                  returnObjects: true
                })}
              />

              <CollapsableList
                label={t('prepare.sharedServices.title')}
                items={t<string[]>('prepare.sharedServices.items', {
                  returnObjects: true
                })}
              />

              <CollapsableList
                label={t('prepare.itSecurityPrivacy.title')}
                items={t<string[]>('prepare.itSecurityPrivacy.items', {
                  returnObjects: true
                })}
              />

              <h3 className="font-heading-lg margin-top-6">
                {t('prepare.whatToBring.title')}
              </h3>
              <ul className="line-height-sans-6">
                {t<string[]>('prepare.whatToBring.items', {
                  returnObjects: true
                }).map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrepareForGRT;
