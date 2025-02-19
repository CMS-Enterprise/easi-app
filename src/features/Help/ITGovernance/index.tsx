import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import Divider from 'components/Divider';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpContacts from 'components/HelpContacts';
import HelpPageIntro from 'components/HelpPageIntro';
import MainContent from 'components/MainContent';

import itGovernanceArticles from './articles';

const ITGovernance = () => {
  const { t } = useTranslation('help');
  return (
    <MainContent className="grid-container">
      <HelpBreadcrumb />
      <HelpPageIntro
        heading={t('itGovernance.heading')}
        subheading={t('itGovernance.subheading')}
      />
      <CardGroup className="padding-top-1 padding-bottom-4">
        {itGovernanceArticles.map(article => {
          return (
            <ArticleCard key={article.route} {...article} tag={false} isLink />
          );
        })}
      </CardGroup>
      <Divider />
      <HelpContacts type="IT Governance" />
    </MainContent>
  );
};

export default ITGovernance;
