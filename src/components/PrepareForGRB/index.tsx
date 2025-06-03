import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import NeedHelpBox from 'features/Help/NeedHelpBox';

import Alert from 'components/Alert';
import HelpPageIntro from 'components/HelpPageIntro';
import PageHeading from 'components/PageHeading';
import { ArticleComponentProps } from 'types/articles';

import './index.scss';

export default ({ helpArticle, className }: ArticleComponentProps) => {
  const { t } = useTranslation('governanceReviewBoard');
  return (
    <div className={classNames('prepare-for-grb', className)}>
      <div>
        {!helpArticle ? (
          <PageHeading className="line-height-heading-2">
            {t('help.title')}
          </PageHeading>
        ) : (
          <HelpPageIntro
            type="IT Governance"
            heading={t('help.title')}
            subheading={t('description')}
          />
        )}
        <h2 className="font-heading-xl line-height-heading-2 margin-top-3 margin-bottom-2">
          {t('prepare.whatIsIt.title')}
        </h2>
        <p className="line-height-sans-5">{t('prepare.whatIsIt.body')}</p>
        <h3>{t('help.whatToExpect.title')}</h3>
        <p className="line-height-sans-5">{t('help.whatToExpect.body')}</p>
        <Alert type="info" slim>
          {t('prepare.whatIsIt.alert')}
        </Alert>
        <div className="margin-top-3 padding-2 bg-base-lightest">
          <h3 className="margin-top-0 margin-bottom-1">
            {t('help.tips.title')}
          </h3>
          <ul className="usa-list usa-list--unstyled line-height-body-5 padding-y-0">
            {(
              t('help.tips.items', {
                returnObjects: true
              }) as string[]
            ).map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h2 className="margin-top-6 margin-bottom-2">
          {t('help.whatToBring.title')}
        </h2>
        <p className="margin-y-0">{t('help.whatToBring.copy')}</p>
        <ul className="usa-list usa-list--unstyled line-height-body-5 margin-top-1 padding-y-0">
          {(
            t('help.whatToBring.items', {
              returnObjects: true
            }) as string[]
          ).map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="margin-top-6 margin-bottom-2">
          {t('prepare.possibleOutcomes.title')}
        </h2>
        <p className="margin-y-0">{t('prepare.possibleOutcomes.body')}</p>
        <ul className="usa-list usa-list--unstyled list-style-none line-height-body-5 margin-top-1 padding-y-0">
          {(
            t('prepare.possibleOutcomes.items', {
              returnObjects: true
            }) as string[]
          ).map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <NeedHelpBox className="desktop:grid-col-6 margin-top-5" />
    </div>
  );
};
