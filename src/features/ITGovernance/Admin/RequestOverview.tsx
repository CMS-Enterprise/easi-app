/* eslint-disable import/no-named-default */
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useParams } from 'react-router-dom';
import { Grid } from '@trussworks/react-uswds';
import classnames from 'classnames';
import UploadForm from 'features/ITGovernance/Requester/SystemIntake/Documents/UploadForm';
import AdditionalInformation from 'features/Miscellaneous/AdditionalInformation';
import NotFound from 'features/Miscellaneous/NotFound';
import {
  SystemIntakeGRBPresentationLinks,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeStatusAdmin,
  useGetSystemIntakeQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import SideNavigation from 'components/SideNavigation';
import useMessage from 'hooks/useMessage';
import { clearBusinessCase, fetchBusinessCase } from 'types/routines';
import { formatDateUtc } from 'utils/date';

import AccordionNavigation from '../../../components/AccordionNavigation';

import PresentationLinksForm from './GRBReview/PresentationLinksForm';
import Actions from './Actions';
import BusinessCaseReview from './BusinessCaseReview';
import Dates from './Dates';
import Decision from './Decision';
import Documents from './Documents';
import Feedback from './Feedback';
import GRBReview from './GRBReview';
import IntakeReview from './IntakeReview';
import ITGovAdminContext from './ITGovAdminContext';
import LifecycleID from './LifecycleID';
import Notes from './Notes';
import subNavItems from './subNavItems';
import Summary from './Summary';

import './index.scss';

type RequestOverviewProps = {
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  grbReviewStartedAt?: string | null;
};

const RequestOverview = ({
  grbReviewers,
  grbReviewStartedAt
}: RequestOverviewProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const flags = useFlags();

  const { Message } = useMessage();

  const dispatch = useDispatch();

  const isITGovAdmin = useContext(ITGovAdminContext);

  const { systemId, activePage, subPage } = useParams<{
    systemId: string;
    activePage: string;
    subPage?: string;
  }>();

  const { loading, data } = useGetSystemIntakeQuery({
    variables: {
      id: systemId
    }
  });

  const systemIntake = data?.systemIntake;

  const lcidRetiringSoon =
    systemIntake?.statusAdmin === SystemIntakeStatusAdmin.LCID_RETIRING_SOON &&
    systemIntake?.lcidRetiresAt;

  const businessCase = useSelector(
    (state: AppState) => state.businessCase.form
  );

  /** Hides summary and side navigation for all action subpages */
  const fullPageLayout: boolean =
    activePage === 'resolutions' || activePage === 'manage-lcid' || !!subPage;

  const navItems = subNavItems(systemId, isITGovAdmin, flags);

  useEffect(() => {
    if (systemIntake?.businessCaseId) {
      dispatch(fetchBusinessCase(systemIntake.businessCaseId));
    } else {
      dispatch(clearBusinessCase());
    }
  }, [dispatch, systemIntake?.businessCaseId]);

  if (!loading && !systemIntake) {
    return <NotFound />;
  }

  return (
    <MainContent className="easi-grt" data-testid="grt-request-overview">
      {systemIntake && !fullPageLayout && (
        <Summary
          {...systemIntake}
          requestName={systemIntake.requestName || ''}
          contractNumbers={
            systemIntake?.contractNumbers?.map(c => c.contractNumber) || []
          }
        />
      )}

      {!fullPageLayout && <AccordionNavigation items={navItems} />}

      <section className="grid-container">
        {lcidRetiringSoon && (
          <Alert
            type="info"
            slim
            className="margin-top-2 margin-bottom-neg-1"
            data-testid="lcid-retiring-soon-alert"
          >
            {t('lcidAlertMessage', {
              lcid: systemIntake?.lcid,
              date: formatDateUtc(systemIntake?.lcidRetiresAt, 'MM/dd/yyyy')
            })}
          </Alert>
        )}
        <Message className="margin-top-2" />

        <Grid
          row
          gap
          className={classnames({
            'margin-bottom-5 margin-top-7': !fullPageLayout
          })}
        >
          {!fullPageLayout && (
            <SideNavigation
              items={navItems}
              returnLink={{
                to: '/',
                text: t('back.allRequests')
              }}
              className="desktop:grid-col-3 desktop:display-block display-none sticky top-8"
            />
          )}

          {loading && (
            <div className="margin-x-auto">
              <PageLoading />
            </div>
          )}

          {!loading && !!systemIntake && (
            <section
              className={classnames({ 'desktop:grid-col-9': !fullPageLayout })}
            >
              <Switch>
                <Route
                  path="/it-governance/:systemId/intake-request"
                  render={() => <IntakeReview systemIntake={systemIntake} />}
                />

                {flags?.grbReviewTab && (
                  <Route
                    path="/it-governance/:systemId/documents/upload"
                    render={() => <UploadForm type="admin" />}
                  />
                )}

                <Route
                  path="/it-governance/:systemId/documents"
                  render={() => <Documents systemIntake={systemIntake} />}
                />

                <Route
                  path="/it-governance/:systemId/business-case"
                  render={() => (
                    <BusinessCaseReview
                      businessCase={businessCase}
                      grtFeedbacks={systemIntake.governanceRequestFeedbacks}
                    />
                  )}
                />

                <Route
                  path="/it-governance/:systemId/notes"
                  render={() => <Notes />}
                />

                <Route
                  path="/it-governance/:systemId/feedback"
                  render={() => <Feedback systemIntakeId={systemId} />}
                />

                <Route
                  path="/it-governance/:systemId/decision"
                  render={() => <Decision {...systemIntake} />}
                />

                <Route
                  exact
                  path="/it-governance/:systemId/system-information"
                  render={() => (
                    <AdditionalInformation
                      request={systemIntake}
                      type="itgov"
                    />
                  )}
                />

                <Route
                  path="/it-governance/:systemId/lcid"
                  render={() => <LifecycleID systemIntake={systemIntake} />}
                />

                {flags?.grbReviewTab && (
                  <Route
                    path="/it-governance/:systemId/grb-review/presentation-links"
                    render={() => (
                      <PresentationLinksForm
                        {...systemIntake}
                        grbPresentationLinks={
                          systemIntake.grbPresentationLinks as SystemIntakeGRBPresentationLinks
                        }
                      />
                    )}
                  />
                )}

                {flags?.grbReviewTab && (
                  <Route
                    path="/it-governance/:systemId/grb-review/:action(add|edit)?"
                    exact
                    render={() => (
                      <GRBReview
                        {...systemIntake}
                        businessCase={businessCase}
                        grbReviewers={grbReviewers}
                        grbReviewStartedAt={grbReviewStartedAt}
                      />
                    )}
                  />
                )}

                {/* GRT only routes */}

                <Route
                  path="/it-governance/:systemId/dates"
                  render={() => <Dates systemIntake={systemIntake} />}
                />

                <Route
                  path="/it-governance/:systemId/(actions|resolutions|manage-lcid)/:subPage?"
                  render={() => <Actions systemIntake={systemIntake} />}
                />

                <Route path="*" component={NotFound} />
              </Switch>
            </section>
          )}
        </Grid>
      </section>
    </MainContent>
  );
};

export default RequestOverview;
