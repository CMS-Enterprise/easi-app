import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntake } from 'types/routines';

import './index.scss';

const GovernanceReviewTeam = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { systemId } = useParams();

  useEffect(() => {
    dispatch(fetchSystemIntake(systemId));
  }, [dispatch, systemId]);

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );

  const component = cmsDivisionsAndOffices.find(
    c => c.name === systemIntake.requester.component
  );

  const requesterNameAndComponent = component
    ? `${systemIntake.requester.name}, ${component.acronym}`
    : systemIntake.requester.name;

  return (
    <PageWrapper className="easi-grt">
      <Header />
      <MainContent>
        <section className="easi-grt__request-summary">
          <div className="grid-container padding-y-2">
            <BreadcrumbNav>
              <li>
                <Link className="text-white" to="/">
                  Home
                </Link>
                <i className="fa fa-angle-right margin-x-05" aria-hidden />
              </li>
              <li>{systemIntake.requestName}</li>
            </BreadcrumbNav>
            <dl className="easi-grt__request-info">
              <div>
                <dt>{t('intake:fields.requestName')}</dt>
                <dd>{systemIntake.requestName}</dd>
              </div>
              <div className="easi-grt__request-info-col">
                <div className="easi-grt__description-group">
                  <dt>{t('intake:fields.requester')}</dt>
                  <dd>{requesterNameAndComponent}</dd>
                </div>
                <div className="easi-grt__description-group">
                  <dt>{t('intake:fields.submissionDate')}</dt>
                  <dd>
                    {systemIntake.submittedAt
                      ? systemIntake.submittedAt.toLocaleString(
                          DateTime.DATE_FULL
                        )
                      : 'N/A'}
                  </dd>
                </div>
                <div className="easi-grt__description-group">
                  <dt>{t('intake:fields.requestFor')}</dt>
                  <dd>N/A</dd>
                </div>
              </div>
            </dl>
          </div>
        </section>
        <section>
          <nav />
          <section />
        </section>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default GovernanceReviewTeam;
