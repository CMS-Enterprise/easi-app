import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpPageIntro from 'components/HelpPageIntro';
import MainContent from 'components/MainContent';
import itGovernanceArticles from 'views/Help/ITGovernance/articles';
import section508Articles from 'views/Help/Section508/articles';

import trbArticles from '../TechnicalReviewBoard/articles';

const AllHelp = () => {
  const { t } = useTranslation('help');

  const allArticles = itGovernanceArticles
    .concat(section508Articles)
    .concat(trbArticles);

  return (
    <MainContent className="grid-container margin-bottom-10">
      <HelpBreadcrumb type="Back" />
      <HelpPageIntro heading={t('allHelpArticles')} />
      <CardGroup className="margin-y-2">
        {allArticles.map(article => (
          <ArticleCard key={article.route} {...article} isLink />
        ))}
      </CardGroup>
    </MainContent>
  );
};

export default AllHelp;
