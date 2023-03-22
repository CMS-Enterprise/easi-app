import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Route, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, GridContainer, IconArrowBack } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import useMessage from 'hooks/useMessage';
import useTRBAttendees from 'hooks/useTRBAttendees';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import {
  GetTrbRequestSummary,
  GetTrbRequestSummaryVariables
} from 'queries/types/GetTrbRequestSummary';
import { AppState } from 'reducers/rootReducer';
import { formatDateLocal } from 'utils/date';
import user from 'utils/user';
import AccordionNavigation from 'views/GovernanceReviewTeam/AccordionNavigation';
import NotFound from 'views/NotFound';

import Summary from './components/Summary';
import subNavItems from './subNavItems';

import './index.scss';

type SideNavProps = {
  activePage: string;
  trbRequestId: string;
};

/** Side navigation */
const SideNavigation = ({
  /** Active page path */
  activePage,
  /** Request ID */
  trbRequestId
}: SideNavProps) => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <nav>
      <ul className="trb-admin__nav-list usa-list usa-list--unstyled">
        <li className="trb-admin__view-all-link margin-bottom-4">
          <Link to="/">
            <IconArrowBack aria-hidden />
            {t('adminHome.subnav.back')}
          </Link>
        </li>
        {subNavItems(trbRequestId).map(({ route, text, groupEnd }) => {
          const isActivePage: boolean = route.split('/')[3] === activePage;
          return (
            <li
              key={text}
              className={classNames('trb-admin__nav-link', {
                'trb-admin__nav-link--active': isActivePage,
                'trb-admin__nav-link--border': groupEnd
              })}
            >
              <Link to={route}>
                <span>{t(text)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/** Wrapper for TRB admin view components */
export default function AdminHome() {
  // Current user info from redux
  const { groups, isUserSet } = useSelector((state: AppState) => state.auth);

  const flags = useFlags();

  // Get url params
  const { id, activePage } = useParams<{
    id: string;
    activePage: string;
  }>();

  // TRB request query
  const { data, loading } = useQuery<
    GetTrbRequestSummary,
    GetTrbRequestSummaryVariables
  >(GetTrbRequestSummaryQuery, {
    variables: { id }
  });
  /** Current trb request */
  const trbRequest = data?.trbRequest;

  // Alert feedback from children
  const { message } = useMessage();

  // Get requester object from request attendees
  const {
    data: { requester, loading: requesterLoading }
  } = useTRBAttendees(id);

  /**
   * Requester name and cms office acronym
   */
  const requesterString = useMemo(() => {
    // If loading, return null
    if (requesterLoading) return null;

    // If requester component is not set, return name or EUA
    if (!requester.component)
      return requester?.userInfo?.commonName || requester?.userInfo?.euaUserId;

    /** Requester component */
    const requesterComponent = cmsDivisionsAndOffices.find(
      object => object.name === requester.component
    );

    // Return requester name and component acronym
    return `${requester?.userInfo?.commonName}, ${requesterComponent?.acronym}`;
  }, [requester, requesterLoading]);

  /**
   * Request submission date for summary
   */
  const submissionDate = trbRequest?.createdAt
    ? formatDateLocal(trbRequest.createdAt, 'MMMM d, yyyy')
    : '';

  // If TRB request is loading or user is not set, return page loading
  if (loading || !isUserSet) {
    return <PageLoading />;
  }

  // If TRB request does not exist or user is not TRB admin, return page not found
  if (!trbRequest || !user.isTrbAdmin(groups, flags)) {
    return <NotFound />;
  }

  return (
    <div id="trbAdminHome">
      {/* Request summary */}
      <Summary
        trbRequestId={id}
        name={trbRequest.name}
        requestType={trbRequest.type}
        createdAt={trbRequest.createdAt}
        state={trbRequest.state}
        taskStatuses={trbRequest.taskStatuses}
        trbLead={trbRequest.trbLead}
        requester={requester}
        requesterString={requesterString}
        submissionDate={submissionDate}
      />

      {/* Accordion navigation for tablet and mobile */}
      <AccordionNavigation
        activePage={activePage}
        subNavItems={subNavItems(id).map(({ route, text, groupEnd }) => ({
          route,
          text,
          groupEnd
        }))}
        defaultTitle="TRB Request"
      />

      <GridContainer>
        {message}
        <Grid row className="margin-top-5 grid-gap">
          {/* Side navigation */}
          <Grid
            col
            desktop={{ col: 3 }}
            className="display-none desktop:display-block"
          >
            <SideNavigation activePage={activePage} trbRequestId={id} />
          </Grid>

          {/* Page component */}
          <Grid col desktop={{ col: 9 }}>
            {subNavItems(id).map(subpage => (
              <Route exact path={subpage.route} key={subpage.route}>
                <subpage.component
                  trbRequestId={id}
                  requesterString={requesterString}
                  submissionDate={submissionDate}
                />
              </Route>
            ))}
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
}
