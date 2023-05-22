import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpContacts from 'components/HelpContacts';
import HelpPageIntro from 'components/HelpPageIntro';
import MainContent from 'components/MainContent';
import Divider from 'components/shared/Divider';

import trbArticles from './articles';

const TechnicalReviewBoard = () => {
  const { t } = useTranslation('help');

  return (
    <MainContent className="grid-container">
      <HelpBreadcrumb type="Back" />
      <HelpPageIntro
        heading={t('technicalReviewBoard.heading')}
        subheading={t('technicalReviewBoard.subheading')}
      />
      <CardGroup className="padding-top-1 padding-bottom-4">
        {trbArticles.map(article => {
          return (
            <ArticleCard key={article.route} {...article} tag={false} isLink />
          );
        })}
      </CardGroup>
      <Divider />
      <HelpContacts type="Technical Review Board" />
    </MainContent>
  );
};

export default TechnicalReviewBoard;
