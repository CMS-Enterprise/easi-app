import React from 'react';
import { useTranslation } from 'react-i18next';

import CollapsableList from 'components/CollapsableList';
import PageHeading from 'components/PageHeading';
import NeedHelpBox from 'components/shared/NeedHelpBox';

import './index.scss';

type PrepareForGRTProps = {
  helpType?: string;
};

const PrepareForGRT = ({ helpType }: PrepareForGRTProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  return (
    <div className="prepare-for-grt">
      <div>
        <PageHeading className="line-height-heading-2">
          {t('prepare.title')}
        </PageHeading>
        {helpType && (
          <>
            <div>{helpType}</div>
            <div>{t('description')}</div>
          </>
        )}
        <h2 className="font-heading-xl line-height-heading-2 margin-top-3 margin-bottom-2">
          {t('prepare.whatToExpect.title')}
        </h2>
        <ul className="list-style-none margin-0 padding-0">
          {t<string[]>('prepare.whatToExpect.items', {
            returnObjects: true
          }).map(item => (
            <li className="line-height-sans-6" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="margin-top-3 padding-2 bg-base-lightest">
        <h3 className="margin-top-0 margin-bottom-2 font-heading-lg line-height-heading-2">
          {t('prepare.howToBestPrepare.title')}
        </h3>
        <div className="line-height-sans-6">
          {t('prepare.howToBestPrepare.body')}
        </div>

        <CollapsableList
          className="margin-top-2"
          label={t('prepare.capitalPlanning.title')}
          items={t<string[]>('prepare.capitalPlanning.items', {
            returnObjects: true
          })}
        />

        <CollapsableList
          className="margin-top-2"
          label={t('prepare.enterpriseArchitecture.title')}
          items={t<string[]>('prepare.enterpriseArchitecture.items', {
            returnObjects: true
          })}
        />

        <CollapsableList
          className="margin-top-2"
          label={t('prepare.sharedServices.title')}
          items={t<string[]>('prepare.sharedServices.items', {
            returnObjects: true
          })}
        />

        <CollapsableList
          className="margin-top-2"
          label={t('prepare.itSecurityPrivacy.title')}
          items={t<string[]>('prepare.itSecurityPrivacy.items', {
            returnObjects: true
          })}
        />
      </div>
      <div>
        <h3 className="font-heading-lg margin-top-6 margin-bottom-2">
          {t('prepare.whatToBring.title')}
        </h3>
        <div>{t('prepare.whatToBring.subtitle')}</div>
        <ul className="bullet-list line-height-body-5">
          {t<string[]>('prepare.whatToBring.items', {
            returnObjects: true
          }).map(item => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <NeedHelpBox />
    </div>
  );
};

export default PrepareForGRT;
