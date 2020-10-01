import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, useParams } from 'react-router-dom';
import classnames from 'classnames';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import { AppState } from 'reducers/rootReducer';
import { fetchBusinessCase, fetchSystemIntake } from 'types/routines';

import BusinessCaseReview from './BusinessCaseReview';

import IntakeReview from './IntakeReview';

import './index.scss';

const GovernanceReviewTeam = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const dispatch = useDispatch();
  const { systemId, activePage } = useParams();

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );

  const businessCase = useSelector(
    (state: AppState) => state.businessCase.form
  );

  useEffect(() => {
    dispatch(fetchSystemIntake(systemId));
  }, [dispatch, systemId]);

  useEffect(() => {
    if (systemIntake.businessCaseId) {
      dispatch(fetchBusinessCase(systemIntake.businessCaseId));
    }
  }, [dispatch, systemIntake.businessCaseId]);

  const component = cmsDivisionsAndOffices.find(
    c => c.name === systemIntake.requester.component
  );

  const requesterNameAndComponent = component
    ? `${systemIntake.requester.name}, ${component.acronym}`
    : systemIntake.requester.name;

  const getNavLinkClasses = (page: string) =>
    classnames('easi-grt__nav-link', {
      'easi-grt__nav-link--active': page === activePage
    });

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
        <section className="grid-container grid-row margin-y-5 ">
          <nav className="tablet:grid-col-2 margin-right-2">
            <ul className="easi-grt__nav-list">
              <li>
                <i className="fa fa-angle-left margin-x-05" aria-hidden />
                <Link to="/">{t('back.allRequests')}</Link>
              </li>
              <li>
                <Link
                  to={`/governance-review-team/${systemId}/intake-request`}
                  aria-label={t('aria.openIntake')}
                  className={getNavLinkClasses('intake-request')}
                >
                  {t('general:intake')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/governance-review-team/${systemId}/business-case`}
                  aria-label={t('aria.openBusiness')}
                  className={getNavLinkClasses('business-case')}
                >
                  {t('general:businessCase')}
                </Link>
              </li>
            </ul>
            <hr />
            <Link
              to={`/governance-review-team/${systemId}/actions`}
              aria-label={t('actions')}
              className={getNavLinkClasses('actions')}
            >
              {t('actions')}
            </Link>
          </nav>
          <section className="tablet:grid-col-9">
            <Route
              path="/governance-review-team/:systemId/intake-request"
              render={() => <IntakeReview systemIntake={systemIntake} />}
            />
            <Route
              path="/governance-review-team/:systemId/business-case"
              render={() => <BusinessCaseReview businessCase={businessCase} />}
            />
            <Route
              path="/governance-review-team/:systemId/actions"
              render={() => <h1>Actions on intake request</h1>}
            />
          </section>
        </section>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default GovernanceReviewTeam;
