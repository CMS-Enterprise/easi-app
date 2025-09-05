import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import NeedHelpBox from 'features/Help/NeedHelpBox';

import Alert from 'components/Alert';
import HelpPageIntro from 'components/HelpPageIntro';
import PageHeading from 'components/PageHeading';
import { ArticleComponentProps } from 'types/articles';

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

        {/* Who is part of the GRB */}
        <h3>{t('help.whoIsPart.title')}</h3>
        <p className="line-height-sans-5 text-bold margin-bottom-0">
          {t('help.whoIsPart.votingMembers.title')}
        </p>
        <p className="line-height-sans-5 margin-top-0">
          {t('help.whoIsPart.votingMembers.body')}
        </p>

        <p className="line-height-sans-5 text-bold margin-bottom-0">
          {t('help.whoIsPart.nonVotingMembers.title')}
        </p>
        <p className="line-height-sans-5 margin-top-0">
          {t('help.whoIsPart.nonVotingMembers.body')}
        </p>

        <p className="line-height-sans-5 text-bold margin-bottom-0">
          {t('help.whoIsPart.alternativeVotingMembers.title')}
        </p>
        <p className="line-height-sans-5 margin-top-0">
          {t('help.whoIsPart.alternativeVotingMembers.body')}
        </p>

        {/* end */}

        <h2 className="font-heading-xl line-height-heading-2 margin-top-3 margin-bottom-2">
          {t('help.whatToExpect.title')}
        </h2>
        <p className="line-height-sans-5">{t('help.whatToExpect.body')}</p>
        <p className="line-height-sans-5 margin-bottom-0">
          {t('help.whatToExpect.importantItems.copy')}
        </p>
        <ul className="usa-list line-height-body-5 padding-y-0 margin-top-0">
          {(
            t('help.whatToExpect.importantItems.items', {
              returnObjects: true
            }) as string[]
          ).map(item => (
            <li key={item} className="maxw-none">
              {item}
            </li>
          ))}
        </ul>

        <div className="margin-top-3 padding-2 bg-base-lightest">
          <h3 className="margin-top-0 margin-bottom-1">
            {t('help.tips.title')}
          </h3>
          <ul className="usa-list line-height-body-5 padding-y-0">
            {(
              t('help.tips.items', {
                returnObjects: true
              }) as string[]
            ).map(item => (
              <li key={item} className="maxw-none">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3>{t('help.types.title')}</h3>
      <p className="line-height-sans-5 text-bold margin-y-0">
        {t('help.types.standard.title')}
      </p>
      <p className="line-height-sans-5 margin-y-0">
        {t('help.types.standard.copy')}
      </p>

      <Alert type="info" slim>
        {t('prepare.whatIsIt.alert')}
      </Alert>

      <p className="line-height-sans-5 text-bold margin-bottom-0">
        {t('help.types.async.title')}
      </p>
      <p className="line-height-sans-5 margin-y-0">
        {t('help.types.async.copy')}
      </p>

      <h2 className="margin-top-3 margin-bottom-2">
        {t('prepare.possibleOutcomes.title')}
      </h2>
      <p className="line-height-sans-5 margin-y-0">
        {t('prepare.possibleOutcomes.body')}
      </p>
      <ul className="usa-list line-height-body-5 margin-top-1 padding-y-0">
        {(
          t('prepare.possibleOutcomes.items', {
            returnObjects: true
          }) as string[]
        ).map(item => (
          <li key={item} className="maxw-none">
            {item}
          </li>
        ))}
      </ul>
      <NeedHelpBox className="desktop:grid-col-6 margin-top-5" />
    </div>
  );
};
