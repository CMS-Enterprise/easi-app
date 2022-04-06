import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup, Link as UswdsLink } from '@trussworks/react-uswds';
import classNames from 'classnames';

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

type ArticleLinkProps = {
  key: number;
  href: string;
  copy: string;
};

const HelpHome = () => {
  const { t } = useTranslation('help');

  const contacts: ContactProps[] = t('additionalContacts.contacts', {
    returnObjects: true
  });

  const articleLinks: ArticleLinkProps[] = t('articleLinks', {
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
            <ArticleCard key={article.route} {...article} />
          ))}
        </CardGroup>
        <div className="help-home__articles-links display-flex">
          <p className="text-base margin-y-0 margin-right-3">
            3 of {totalArticles} articles
          </p>
          {Object.keys(articleLinks).map((key: any) => {
            return (
              <UswdsReactLink
                key={articleLinks[key].href}
                to={articleLinks[key].href}
                className={classNames('margin-right-5', {
                  'help-home__link--all': key === 'allHelp'
                })}
              >
                {articleLinks[key].copy}
              </UswdsReactLink>
            );
          })}
        </div>
      </div>
      <hr className="help-home__hr margin-bottom-6" />
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-1">
        {t('additionalContacts.heading')}
      </PageHeading>
      <p className="margin-bottom-4">{t('additionalContacts.subheading')}</p>
      <div className="grid-row grid-gap-lg">
        {Object.keys(contacts).map((key: any) => (
          <div key={key} className="tablet:grid-col-4 padding-bottom-4">
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
              Email addresses
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
  );
};

export default HelpHome;
