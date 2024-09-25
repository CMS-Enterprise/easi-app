import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';
import classnames from 'classnames';

import ArticleCard from 'components/ArticleCard';
import MainContent from 'components/MainContent';
import itGovernanceArticles from 'views/Help/ITGovernance/articles';
import trbArticles from 'views/Help/TechnicalReviewBoard/articles';

const helpArticles = [...itGovernanceArticles, ...trbArticles];

type HelpArticle = typeof helpArticles[number];

type RelatedArticlesProps = {
  articles: HelpArticle['translation'][];
  className?: string;
};

const RelatedArticles = ({ className, articles }: RelatedArticlesProps) => {
  const { t } = useTranslation('help');

  const selectedArticles = helpArticles.filter(({ translation }) =>
    articles?.includes(translation)
  );

  return (
    <div className={classnames('bg-base-lightest', className)}>
      <MainContent className="grid-container padding-y-2">
        <h2 className="margin-bottom-1">{t('relatedHelp')}</h2>
        <dt className="margin-bottom-4">{t('relatedDescription')}</dt>
        <CardGroup className="margin-y-2">
          {selectedArticles.map(article => (
            <ArticleCard key={article.route} {...article} isLink />
          ))}
        </CardGroup>
      </MainContent>
    </div>
  );
};

export default RelatedArticles;
