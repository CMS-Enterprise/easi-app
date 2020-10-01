import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
  RouteComponentProps,
  useLocation,
  withRouter
} from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import { useFlags } from 'contexts/flagContext';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import ActionBanner from 'components/shared/ActionBanner';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import { Flags } from 'types/flags';
import { fetchBusinessCases, fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

import './index.scss';

type HomeProps = RouteComponentProps;

const Home = ({ history }: HomeProps) => {
  const { t } = useTranslation();
  // const { authState } = useOktaAuth();
  const authState = {
    isAuthenticated: true
  };
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const systemIntakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );
  const businessCases = useSelector(
    (state: AppState) => state.businessCases.businessCases
  );

  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(fetchSystemIntakes());
      dispatch(fetchBusinessCases());
    }
  }, [dispatch, authState.isAuthenticated]);

  const getSystemIntakeBanners = (flags: Flags) => {
    const rootPath = flags.taskListLite ? '/governance-task-list' : '/system';
    return systemIntakes.map((intake: SystemIntakeForm) => {
      switch (intake.status) {
        case 'DRAFT':
          return (
            <ActionBanner
              key={intake.id}
              title={
                intake.requestName
                  ? `${intake.requestName}: Intake Request`
                  : 'Intake Request'
              }
              helpfulText="Your Intake Request is incomplete, please submit it when you are ready so that we can move you to the next phase"
              onClick={() => {
                history.push(`${rootPath}/${intake.id}`);
              }}
              label="Go to Intake Request"
              data-intakeid={intake.id}
            />
          );
        case 'SUBMITTED':
          if (intake.businessCaseId !== null) {
            return null;
          }
          return (
            <ActionBanner
              key={intake.id}
              title={
                intake.requestName
                  ? `${intake.requestName}: Business Case`
                  : 'Business Case'
              }
              helpfulText="Your intake form has been submitted. The admin team will be in touch with you to fill out a Business Case"
              onClick={() => {
                history.push({
                  pathname: `/business/new/general-request-info`,
                  state: {
                    systemIntakeId: intake.id
                  }
                });
              }}
              label="Start my Business Case"
              data-intakeid={intake.id}
            />
          );
        default:
          return null;
      }
    });
  };

  const getBusinessCaseBanners = (flags: Flags) => {
    return businessCases.map((busCase: BusinessCaseModel) => {
      const path = flags.taskListLite
        ? `/governance-task-list/${busCase.id}`
        : `/business/${busCase.id}/general-request-info`;
      switch (busCase.status) {
        case 'DRAFT':
          return (
            <ActionBanner
              key={busCase.id}
              title={
                busCase.requestName
                  ? `${busCase.requestName}: Business Case`
                  : 'Business Case'
              }
              helpfulText="Your Business Case is incomplete, please submit it when you are ready so that we can move you to the next phase"
              onClick={() => {
                history.push(path);
              }}
              label="Go to Business Case"
            />
          );
        case 'SUBMITTED':
          return (
            <ActionBanner
              key={busCase.id}
              title={
                busCase.requestName
                  ? `${busCase.requestName}: Business Case`
                  : 'Business Case'
              }
              helpfulText="The form has been submitted for review. You can update it and re-submit it any time in the process"
              onClick={() => {
                history.push(path);
              }}
              label="Update Business Case"
            />
          );
        default:
          return null;
      }
    });
  };

  const flags = useFlags();
  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <div className="margin-y-6">
          {location.state && location.state.confirmationText && (
            <div className="border-05 border-green">
              <div className="fa fa-check fa-2x display-inline-block text-middle text-green margin-left-1 margin-right-2" />
              <p className="display-inline-block text-middle margin-y-105">
                {location.state.confirmationText}
              </p>
            </div>
          )}
          {getSystemIntakeBanners(flags)}
          {getBusinessCaseBanners(flags)}
        </div>
        <div className="tablet:grid-col-9">
          <h1 className="margin-top-6">{t('home:title')}</h1>
          <p className="line-height-body-5 font-body-lg text-light">
            {t('home:subtitle')}
          </p>
          <div className="easi-home__info-wrapper">
            <div className="easi-home__info-icon">
              <i className="fa fa-info" />
            </div>
            <p className="line-height-body-5">
              <Trans i18nKey="home:easiInfo">
                zeroIndex
                <a
                  href="https://share.cms.gov/Office/OIT/CIOCorner/Lists/Intake/NewForm.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  localeLink
                </a>
              </Trans>
            </p>
          </div>
          {authState.isAuthenticated ? (
            <UswdsLink
              className="usa-button"
              asCustom={Link}
              variant="unstyled"
              to="/governance-overview"
            >
              {t('home:startNow')}
            </UswdsLink>
          ) : (
            <UswdsLink
              className="usa-button"
              asCustom={Link}
              variant="unstyled"
              to="/signin"
            >
              {t('home:signIn')}
            </UswdsLink>
          )}
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default withRouter(Home);
