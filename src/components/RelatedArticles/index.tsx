import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';
import classnames from 'classnames';

import ArticleCard from 'components/ArticleCard';
import MainContent from 'components/MainContent';
import { ArticleProps, ArticleTypeProps } from 'types/articles';
import itGovernanceArticles from 'views/Help/ITGovernance/articles';
import trbArticles from 'views/Help/TechnicalReviewBoard/articles';

type RelatedArticlesProps = {
  className?: string;
  type: ArticleTypeProps;
  currentArticle: string;
};

const articleGroup: Record<ArticleTypeProps, ArticleProps[]> = {
  'IT Governance': itGovernanceArticles,
  'Technical Review Board': trbArticles
};

const RelatedArticles = ({
  className,
  type,
  currentArticle
}: RelatedArticlesProps) => {
  const { t } = useTranslation('help');

  const selectedArticles = articleGroup[type]
    .filter(article => article.translation !== currentArticle)
    .slice(0, 3);

  if (selectedArticles.length === 0) {
    return <></>;
  }

  return (
    <div className="bg-base-lightest">
      <MainContent className="grid-container padding-y-2">
        <h2 className="margin-bottom-1">{t('relatedHelp')}</h2>
        <dt className="margin-bottom-4">{t('relatedDescription')}</dt>
        <CardGroup className={classnames('margin-y-2', className)}>
          {selectedArticles.map(article => (
            <ArticleCard key={article.route} {...article} isLink />
          ))}
        </CardGroup>
      </MainContent>
    </div>
  );
};

export default RelatedArticles;
