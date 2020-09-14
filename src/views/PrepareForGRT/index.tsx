import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Button, Link as USWDSLink } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';

import './index.scss';

type CollapsibleListProps = {
  items: string[];
  label: string;
};

const CollapsibleList = (props: CollapsibleListProps) => {
  const { label, items } = props;
  const id = kebabCase(label);

  return (
    <div className="margin-top-3">
      <CollapsableLink id={id} label={label}>
        <ul className="margin-bottom-0 margin-top-1 padding-left-205 line-height-body-5">
          {items.map(item => (
            <li className="margin-bottom-1" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </CollapsableLink>
    </div>
  );
};

type NumberedListItemProps = {
  stepName: string;
  header: string;
  body: string;
};

const PrepareForGRT = () => {
  const history = useHistory();
  const { t } = useTranslation('governanceReviewTeam');
  return (
    <PageWrapper className="easi-prepare-for-grt">
      <Header />
      <MainContent className="margin-bottom-5">
        <div className="grid-container">
          <BreadcrumbNav className="margin-y-2">
            <li>
              <Link to="/" className="text-ink">
                Home
              </Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li>
              <Link to="/tbd" className="text-ink">
                Get governance approval
              </Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li>
              <Link to="/governance-overview" aria-current="location">
                {t('prepare.title')}
              </Link>
            </li>
          </BreadcrumbNav>
          <div className="grid-row flex-justify">
            <div className="grid-col-9">
              <h1 className="font-heading-2xl margin-top-4 with-subhead">
                {t('prepare.title')}
              </h1>
              <h2 className="font-heading-xl margin-top-6">
                {t('prepare.whatToExpect.title')}
              </h2>
              <ul>
                {t<string[]>('prepare.whatToExpect.items', {
                  returnObjects: true
                }).map(item => (
                  <li className="line-height-sans-6" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid-col-2">
              <div className="sidebar margin-top-4">
                <h3 className="font-sans-sm">
                  Need help? Contact the Governance team
                </h3>
                <p>
                  <USWDSLink href="mailto:ITgovernance@cms.hhs.gov">
                    ITgovernance@cms.hhs.gov
                  </USWDSLink>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="distinct-content margin-top-4">
          <div className="grid-container">
            <div className="grid-row">
              <div className="grid-col-10">
                <h2 className="font-heading-xl">
                  {t('prepare.howToBestPrepare.title')}
                </h2>
                <h3 className="font-heading-lg">
                  {t('prepare.howToBestPrepare.subtitle')}
                </h3>
                <p className="line-height-sans-6">
                  {t('prepare.howToBestPrepare.body')}
                </p>

                <CollapsibleList
                  label={t('prepare.capitalPlanning.title')}
                  items={t<string[]>('prepare.capitalPlanning.items', {
                    returnObjects: true
                  })}
                />

                <CollapsibleList
                  label={t('prepare.enterpriseArchitecture.title')}
                  items={t<string[]>('prepare.enterpriseArchitecture.items', {
                    returnObjects: true
                  })}
                />

                <CollapsibleList
                  label={t('prepare.sharedServices.title')}
                  items={t<string[]>('prepare.sharedServices.items', {
                    returnObjects: true
                  })}
                />

                <CollapsibleList
                  label={t('prepare.itSecurityPrivacy.title')}
                  items={t<string[]>('prepare.itSecurityPrivacy.items', {
                    returnObjects: true
                  })}
                />

                <h3 className="font-heading-lg margin-top-6">
                  {t('prepare.whatToBring.title')}
                </h3>
                <ul className="line-height-sans-6">
                  {t<string[]>('prepare.whatToBring.items', {
                    returnObjects: true
                  }).map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-container">
          <Button type="button" onClick={() => history.goBack()} unstyled>
            Back
          </Button>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default PrepareForGRT;
