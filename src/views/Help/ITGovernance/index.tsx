import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Button, CardGroup, IconArrowBack } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import HelpContacts from 'components/HelpContacts';
import HelpPageIntro from 'components/HelpPageIntro';
import Divider from 'components/shared/Divider';

import itGovernanceArticles from './articles';
import PrepareForGRT from './PrepareForGRT';

const Breadcrumb = () => {
  const history = useHistory();
  const { t } = useTranslation('help');
  return (
    <Button
      type="button"
      unstyled
      onClick={() => history.goBack()}
      className="margin-top-7"
    >
      <IconArrowBack className="margin-right-05 margin-top-3px text-tbottom" />
      {t('back')}
    </Button>
  );
};

const PageContent = () => {
  const { t } = useTranslation('help');
  return (
    <>
      <HelpPageIntro
        heading={t('itGovernance.heading')}
        subheading={t('itGovernance.subheading')}
      />
      <CardGroup className="padding-top-1 padding-bottom-4">
        {itGovernanceArticles.map(article => {
          return <ArticleCard key={article.route} {...article} tag={false} />;
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
      <Breadcrumb />
      <Switch>
        <Route
          path="/help/it-governance/prepare-for-grt"
          render={() => <PrepareForGRT />}
        />
        <Route path="/help/it-governance" render={() => <PageContent />} />
      </Switch>
    </>
  );
};

export default ITGovernance;
