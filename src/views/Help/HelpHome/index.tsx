import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import HelpContacts from 'components/HelpContacts';
import HelpPageIntro from 'components/HelpPageIntro';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Divider from 'components/shared/Divider';
import itGovernanceArticles from 'views/Help/ITGovernance/articles';
import section508Articles from 'views/Help/Section508/articles';

import './index.scss';

const HelpHome = () => {
  const { t } = useTranslation('help');

  const allArticles = itGovernanceArticles.concat(section508Articles);
  const totalArticles = allArticles.length;

  const showTopThreeArticles = allArticles.slice(0, 3);

  return (
    <MainContent className="grid-container">
      <div className="help-home">
        <HelpPageIntro
          heading={t('heading')}
          subheading={t('subheading')}
          className="margin-top-8"
        />
        <div className="help-home__articles margin-bottom-7">
          <CardGroup className="margin-y-2">
            {showTopThreeArticles.map(article => (
              <ArticleCard key={article.route} {...article} isLink />
            ))}
          </CardGroup>
          <div className="help-home__articles-links">
            <div className="help-home__articles-links--first-row">
              <p className="text-base">
                <Trans i18nKey="help:threeOfTotalArticles">
                  indexZero {{ totalArticles }} indexOne
                </Trans>
              </p>
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
              <UswdsReactLink
                to={t('articleLinks.section508.href')}
                className=""
              >
                {t('articleLinks.section508.copy')}
              </UswdsReactLink>
            </div>
          </div>
        </div>
        <Divider />
        <HelpContacts type={['IT Governance', 'Section 508']} />
      </div>
    </MainContent>
  );
};

export default HelpHome;
