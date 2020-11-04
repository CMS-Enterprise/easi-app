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
import { isIntakeClosed, isIntakeOpen } from 'utils/systemIntake';

import ChooseAction from './Actions/ChooseAction';
import IssueLifecycleId from './Actions/IssueLifecycleId';
import SubmitAction from './Actions/SubmitAction';
import BusinessCaseReview from './BusinessCaseReview';
import IntakeReview from './IntakeReview';

import './index.scss';

const GovernanceReviewTeam = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const { t: actionsT } = useTranslation('action');
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
                <dt>{t('intake:fields.projectName')}</dt>
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

          <div
            className={classnames({
              'bg-base-lightest': isIntakeClosed(systemIntake.status),
              'easi-grt__status--open': isIntakeOpen(systemIntake.status)
            })}
          >
            <div className="grid-container overflow-auto">
              <dl className="easi-grt__status-info text-gray-90">
                <dt className="text-bold">{t('status.label')}</dt>
                &nbsp;
                <dd
                  className="text-uppercase text-white bg-base-dark padding-05 font-body-3xs"
                  data-testid="grt-status"
                >
                  {isIntakeClosed(systemIntake.status)
                    ? t('status.closed')
                    : t('status.open')}
                </dd>
                {systemIntake.lcid && (
                  <>
                    <dt>{t('intake:lifecycleId')}:&nbsp;</dt>
                    <dd data-testid="grt-lcid">{systemIntake.lcid}</dd>
                  </>
                )}
              </dl>
            </div>
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
              exact
              render={() => <ChooseAction businessCase={businessCase} />}
            />
            <Route
              path="/governance-review-team/:systemId/actions/not-it-request"
              render={() => (
                <SubmitAction
                  action="NOT_IT_REQUEST"
                  actionName={actionsT('actions.notItRequest')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/need-biz-case"
              render={() => (
                <SubmitAction
                  action="NEED_BIZ_CASE"
                  actionName={actionsT('actions.needBizCase')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/provide-feedback-need-biz-case"
              render={() => (
                <SubmitAction
                  action="PROVIDE_FEEDBACK_NEED_BIZ_CASE"
                  actionName={actionsT('actions.provideFeedbackNeedBizCase')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/provide-feedback-keep-draft"
              render={() => (
                <SubmitAction
                  action="PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT"
                  actionName={actionsT('actions.provideGrtFeedbackKeepDraft')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/ready-for-grt"
              render={() => (
                <SubmitAction
                  action="READY_FOR_GRT"
                  actionName={actionsT('actions.readyForGrt')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/biz-case-needs-changes"
              render={() => (
                <SubmitAction
                  action="BIZ_CASE_NEEDS_CHANGES"
                  actionName={actionsT('actions.bizCaseNeedsChanges')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/issue-lcid"
              render={() => <IssueLifecycleId />}
            />
          </section>
        </section>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default GovernanceReviewTeam;
