import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import NeedHelpBox from 'features/Help/InfoBox/NeedHelpBox';

import CollapsableList from 'components/CollapsableList';
import HelpPageIntro from 'components/HelpPageIntro';
import PageHeading from 'components/PageHeading';
import { ArticleComponentProps } from 'types/articles';

export default ({ helpArticle, className }: ArticleComponentProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  return (
    <div className={classNames('prepare-for-grt', className)}>
      <div>
        {!helpArticle ? (
          <PageHeading className="line-height-heading-2">
            {t('prepare.title')}
          </PageHeading>
        ) : (
          <HelpPageIntro
            type="IT Governance"
            heading={t('prepare.title')}
            subheading={t('description')}
          />
        )}
        <h2 className="font-heading-xl line-height-heading-2 margin-top-3 margin-bottom-2">
          {t('prepare.whatToExpect.title')}
        </h2>
        <ul className="list-style-none margin-0 padding-0">
          {t<string[]>('prepare.whatToExpect.items', {
            returnObjects: true
          }).map((item, idx) => (
            <li
              className={classNames('line-height-sans-6', {
                'margin-top-1': idx
              })}
              key={item}
            >
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
        <ul className="list-style-middot-inner line-height-body-5">
          {t<string[]>('prepare.whatToBring.items', {
            returnObjects: true
          }).map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <NeedHelpBox className="desktop:grid-col-6 margin-top-5" />
    </div>
  );
};
