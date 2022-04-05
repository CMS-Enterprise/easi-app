import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';
import classnames from 'classnames';

import ArticleCard from 'components/ArticleCard';
import MainContent from 'components/MainContent';
import { ArticleTypeProps } from 'types/articles';
import itGovernanceArticles from 'views/Help/ITGovernance/articles';
import section508Articles from 'views/Help/Section508/articles';

type RelatedArticlesProps = {
  className?: string;
  type: ArticleTypeProps;
};

const RelatedArticles = ({ className, type }: RelatedArticlesProps) => {
  const { t } = useTranslation('help');

  const foundArticles =
    type === 'IT Governance' ? itGovernanceArticles : section508Articles;

  const selectedArticles = foundArticles.slice(0, 3);

  return (
    <div className="bg-base-lightest">
      <MainContent className="grid-container padding-y-2">
        <h2 className="margin-bottom-1">{t('relatedHelp')}</h2>
        <dt className="margin-bottom-4">{t('relatedDescription')}</dt>
        <CardGroup className={classnames('margin-y-2', className)}>
          {selectedArticles.map(article => (
            <ArticleCard {...article} />
          ))}
        </CardGroup>
      </MainContent>
    </div>
  );
};

export default RelatedArticles;
