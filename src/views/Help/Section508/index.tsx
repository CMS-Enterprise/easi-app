import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import { CardGroup, Link as UswdsLink } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpContacts from 'components/HelpContacts';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';

import section508Articles from './articles';
import StepsInvolved from './StepsInvolved';

const PageContent = () => {
  const { t } = useTranslation('help');
  return (
    <>
      <PageHeading className="margin-bottom-1 margin-top-3">
        {t('section508.heading')}
      </PageHeading>
      <p className="font-body-lg margin-top-0 margin-bottom-4 line-height-body-5">
        {t('section508.subheading')}
        <UswdsLink
          variant="external"
          target="_blank"
          href={`https://${t('section508.website')}`}
        >
          {t('section508.website')}
        </UswdsLink>
      </p>
      <CardGroup className="padding-top-1 padding-bottom-4">
        {section508Articles.map(article => {
          return <ArticleCard key={article.route} {...article} tag={false} />;
        })}
      </CardGroup>
      <Divider />
      <div className="padding-bottom-5 desktop:padding-bottom-7">
        <div className="grid-row grid-gap-lg">
          <HelpContacts type="Section 508" />
        </div>
      </div>
    </>
  );
};

const Section508 = () => {
  return (
    <>
      <HelpBreadcrumb type="Back" />
      <PageContent />
      <Switch>
        <Route
          path="/help/it-governance/prepare-for-grt"
          render={() => <StepsInvolved />}
        />
        <Route path="/help/it-governance" render={() => <PageContent />} />
      </Switch>
    </>
  );
};

export default Section508;
