import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import { CardGroup } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpContacts from 'components/HelpContacts';
import HelpPageIntro from 'components/HelpPageIntro';
import Divider from 'components/shared/Divider';

import itGovernanceArticles from './articles';
import PrepareForGRT from './PrepareForGRT';

const PageContent = () => {
  const { t } = useTranslation('help');
  return (
    <>
      <HelpBreadcrumb type="Back" />
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
    </>
  );
};

const ITGovernance = () => {
  return (
    <>
      <Switch>
        <Route
          path="/help/it-governance/prepare-for-grt"
          render={() => <PrepareForGRT />}
        />
        <PageContent />
      </Switch>
    </>
  );
};

export default ITGovernance;
