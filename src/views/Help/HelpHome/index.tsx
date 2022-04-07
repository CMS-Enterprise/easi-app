import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup, Link as UswdsLink } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import itGovernanceArticles from 'views/Help/ITGovernance/articles';
import section508Articles from 'views/Help/Section508/articles';

import './index.scss';

type ContactProps = {
  key: string;
  title: string;
  copy: string;
  email: string;
};

const HelpHome = () => {
  const { t } = useTranslation('help');

  const contacts: ContactProps[] = t('additionalContacts.contacts', {
    returnObjects: true
  });

  const allArticles = itGovernanceArticles.concat(section508Articles);
  const totalArticles = allArticles.length;

  const showTopThreeArticles = allArticles.slice(0, 3);

  return (
    <div className="help-home">
      <PageHeading className="margin-bottom-1">{t('heading')}</PageHeading>
      <p className="font-body-lg margin-top-0 margin-bottom-4">
        {t('subheading')}
      </p>
      <div className="help-home__articles margin-bottom-7">
        <CardGroup className="margin-y-2">
          {showTopThreeArticles.map(article => (
            <ArticleCard key={article.route} {...article} isLink />
          ))}
        </CardGroup>
        <div className="help-home__articles-links">
          <div className="help-home__articles-links--first-row">
            <p className="text-base">3 of {totalArticles} articles</p>
            <UswdsReactLink
              to={t('articleLinks.allHelp.href')}
              className="help-home__link--all"
            >
              {t('articleLinks.allHelp.copy')}
            </UswdsReactLink>
          </div>
          <div className="help-home__articles-links--second-row">
            <UswdsReactLink
              to={t('articleLinks.itGovernance.href')}
              className=""
            >
              {t('articleLinks.itGovernance.copy')}
            </UswdsReactLink>
            <UswdsReactLink to={t('articleLinks.section508.href')} className="">
              {t('articleLinks.section508.copy')}
            </UswdsReactLink>
          </div>
        </div>
      </div>
      <hr className="help-home__hr margin-bottom-6" />
      <div className="help-home__additionalContacts">
        <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-1">
          {t('additionalContacts.heading')}
        </PageHeading>
        <p className="margin-bottom-4">{t('additionalContacts.subheading')}</p>
        <div className="grid-row grid-gap-lg">
          {Object.keys(contacts).map((key: any) => (
            <div
              key={key}
              className="help-home__contact desktop:grid-col-4 desktop:margin-bottom-4 margin-bottom-3"
            >
              <PageHeading
                headingLevel="h3"
                className="margin-top-0 margin-bottom-1"
              >
                {contacts[key].title}
              </PageHeading>
              <p className="margin-top-0 margin-bottom-2 line-height-body-4">
                {contacts[key].copy}
              </p>
              <PageHeading
                headingLevel="h4"
                className="margin-top-0 margin-bottom-05"
              >
                {t('emailAddresses')}
              </PageHeading>
              <UswdsLink
                href={`mailto:${contacts[key].email}`}
                className="margin-top-0"
              >
                {contacts[key].email}
              </UswdsLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpHome;
