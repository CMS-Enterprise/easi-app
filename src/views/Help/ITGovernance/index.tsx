import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
  Button,
  CardGroup,
  IconArrowBack,
  Link as UswdsLink
} from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import PageHeading from 'components/PageHeading';

import itGovernanceArticles from './articles';
import PrepareForGRT from './PrepareForGRT';

type ContactProps = {
  title: string;
  content: string;
  email: string;
};

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
  const { t } = useTranslation('helpITGovernance');
  const contacts: ContactProps[] = t('additionalContacts.contacts', {
    returnObjects: true
  });
  return (
    <>
      <PageHeading className="margin-bottom-1 margin-top-3">
        {t('heading')}
      </PageHeading>
      <p className="font-body-lg margin-top-0 margin-bottom-4 line-height-body-5">
        {t('subheading')}
      </p>
      <CardGroup className="padding-top-1 padding-bottom-5">
        {itGovernanceArticles.map(article => {
          return <ArticleCard key={article.route} {...article} />;
        })}
      </CardGroup>
      <hr className="margin-0" />
      <div className="padding-bottom-5 desktop:padding-bottom-7 padding-top-2">
        <h2 className="margin-bottom-1">{t('additionalContacts.heading')}</h2>
        <p className="font-body-md">{t('additionalContacts.subheading')}</p>
        <div className="grid-row grid-gap-lg">
          {Object.keys(contacts).map((key: any) => {
            return (
              <div
                key={key}
                className="desktop:grid-col-4 margin-bottom-2 desktop:margin-bottom-0"
              >
                <h3 className="margin-bottom-1 margin-top-2">
                  {contacts[key].title}
                </h3>
                <p className="margin-top-1 line-height-body-4">
                  {contacts[key].content}
                </p>
                <h4 className="margin-bottom-1">
                  {t('additionalContacts.emailHeading')}
                </h4>
                <UswdsLink href={`mailto:${contacts[key].email}`}>
                  {contacts[key].email}
                </UswdsLink>
              </div>
            );
          })}
        </div>
      </div>
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
