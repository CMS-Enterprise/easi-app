import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as USWDSLink } from '@trussworks/react-uswds';

import BreadcrumbNav from 'components/BreadcrumbNav';
import CollapsableList from 'components/CollapsableList';
import Header from 'components/Header';
import InlineAlert from 'components/InlineAlert';
import MainContent from 'components/MainContent';

import './index.scss';

const PrepareForGRB = () => {
  const { t } = useTranslation('prepareForGRB');
  return (
    <div className="easi-prepare-for-grb">
      <Header />
      <MainContent>
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
              <Link to="/tbd" aria-current="location">
                {t('title')}
              </Link>
            </li>
          </BreadcrumbNav>
          <div className="grid-row">
            <div className="grid-col-10">
              <h1 className="font-heading-2xl margin-top-4 with-subhead">
                {t('title')}
              </h1>
              <p className="font-body-lg text-light">{t('subtitle')}</p>
              <h2 className="font-heading-xl margin-top-6">
                {t('whatIsIt.title')}
              </h2>
              <p>{t('whatIsIt.body')}</p>
              <ul>
                {t<string[]>('whatIsIt.items', { returnObjects: true }).map(
                  item => (
                    <li className="line-height-sans-6" key={item}>
                      {item}
                    </li>
                  )
                )}
              </ul>

              <InlineAlert className="margin-top-4 margin-bottom-4">
                {t('whatIsIt.alert')}
              </InlineAlert>
              <h3 className="font-heading-lg">{t('possibleOutcomes.title')}</h3>
              <p>{t('possibleOutcomes.body')}</p>
              <ul>
                {t<string[]>('possibleOutcomes.items', {
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
                  {t('howToBestPrepare.title')}
                </h2>

                <CollapsableList
                  label={t('howToBestPrepare.takeWithYou.title')}
                  items={t<string[]>('howToBestPrepare.takeWithYou.items', {
                    returnObjects: true
                  })}
                />

                <CollapsableList
                  label={t('howToBestPrepare.duringTheMeeting.title')}
                  items={t<string[]>(
                    'howToBestPrepare.duringTheMeeting.items',
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
          <p>
            <USWDSLink href="#">Return to task list</USWDSLink>
          </p>
        </div>
      </MainContent>
    </div>
  );
};

export default PrepareForGRB;
