import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Link as USWDSLink
} from '@trussworks/react-uswds';

import CollapsableList from 'components/CollapsableList';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import Alert from 'components/shared/Alert';

import './index.scss';

const PrepareForGRB = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('governanceReviewBoard');
  return (
    <PageWrapper className="easi-prepare-for-grb">
      <Header />
      <MainContent className="margin-bottom-5">
        <div className="grid-container">
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>Home</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/governance-task-list/${systemId}`}
              >
                <span>Get governance approval</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('prepare.title')}</Breadcrumb>
          </BreadcrumbBar>
          <div className="grid-row">
            <div className="grid-col-10">
              <PageHeading>{t('prepare.title')}</PageHeading>
              <h2 className="font-heading-xl margin-top-6">
                {t('prepare.whatIsIt.title')}
              </h2>
              <p className="line-height-sans-6">{t('prepare.whatIsIt.body')}</p>
              <ul>
                {t<string[]>('prepare.whatIsIt.items', {
                  returnObjects: true
                }).map(item => (
                  <li className="line-height-sans-6" key={item}>
                    {item}
                  </li>
                ))}
              </ul>

              <Alert
                type="info"
                inline
                className="margin-top-4 margin-bottom-4"
              >
                {t('prepare.whatIsIt.alert')}
              </Alert>
              <h3 className="font-heading-lg">
                {t('prepare.possibleOutcomes.title')}
              </h3>
              <p>{t('prepare.possibleOutcomes.body')}</p>
              <ul>
                {t<string[]>('prepare.possibleOutcomes.items', {
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

                <CollapsableList
                  label={t('prepare.howToBestPrepare.takeWithYou.title')}
                  items={t<string[]>(
                    'prepare.howToBestPrepare.takeWithYou.items',
                    {
                      returnObjects: true
                    }
                  )}
                />

                <CollapsableList
                  label={t('prepare.howToBestPrepare.duringTheMeeting.title')}
                  items={t<string[]>(
                    'prepare.howToBestPrepare.duringTheMeeting.items',
                    {
                      returnObjects: true
                    }
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid-container">
          <Link to={`/governance-task-list/${systemId}`} className="text-ink">
            Back
          </Link>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default PrepareForGRB;
