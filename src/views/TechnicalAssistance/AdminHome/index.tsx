import React, { useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Route, useParams } from 'react-router-dom';
import {
  Grid,
  GridContainer,
  IconArrowBack,
  ModalRef
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import useMessage from 'hooks/useMessage';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { AppState } from 'reducers/rootReducer';
import { TrbRequestIdRef } from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';
import user from 'utils/user';
import AccordionNavigation from 'views/GovernanceReviewTeam/AccordionNavigation';
import NotFound from 'views/NotFound';

import Summary from './components/Summary';
import { TRBRequestContext } from './RequestContext';
import trbAdminPages from './trbAdminPages';
import TrbAssignLeadModal from './TrbAssignLeadModal';

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
            {t('adminHome.backToRequests')}
          </Link>
        </li>
        {trbAdminPages.map(({ path, text, groupEnd }) => {
          return (
            <li
              key={text}
              className={classNames('trb-admin__nav-link', {
                'trb-admin__nav-link--active': path === activePage,
                'trb-admin__nav-link--border': groupEnd
              })}
            >
              <Link to={`/trb/${trbRequestId}/${path}`}>
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

  const { t } = useTranslation('technicalAssistance');

  const flags = useFlags();

  // Get url params
  const { id, activePage } = useParams<{
    id: string;
    activePage: string;
  }>();

  const trbContextData = useContext(TRBRequestContext);

  const { data, loading } = trbContextData;

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

  // Note count for NoteBox modal rendered on each page
  // const noteCount: number = (data?.trbRequest?.adminNotes || []).length;

  // Assign trb lead modal refs
  const assignLeadModalRef = useRef<ModalRef>(null);
  const assignLeadModalTrbRequestIdRef = useRef<TrbRequestIdRef>(null);

  // If TRB request is loading or user is not set, return page loading
  if (loading || !isUserSet) {
    return <PageLoading />;
  }

  // If TRB request does not exist or user is not TRB admin, return page not found
  if (!trbRequest || !user.isTrbAdmin(groups, flags)) {
    return <NotFound />;
  }

  const submissionDate = formatDateLocal(trbRequest.createdAt, 'MMMM d, yyyy');

  return (
    <div id="trbAdminHome">
      {/* Request summary */}
      <Summary
        trbRequestId={id}
        name={trbRequest.name || t('taskList.defaultName')}
        requestType={trbRequest.type}
        state={trbRequest.state}
        taskStatus={trbRequest.status}
        trbLead={trbRequest.trbLeadInfo.commonName}
        requester={requester}
        requesterString={requesterString}
        submissionDate={submissionDate}
        assignLeadModalRef={assignLeadModalRef}
        assignLeadModalTrbRequestIdRef={assignLeadModalTrbRequestIdRef}
      />

      {/* Accordion navigation for tablet and mobile */}
      <AccordionNavigation
        activePage={activePage}
        subNavItems={trbAdminPages.map(({ path, text, groupEnd }) => ({
          text,
          route: `/trb/${id}/${path}`,
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
            {trbAdminPages.map(subpage => (
              <Route
                exact
                path={`/trb/${id}/${subpage.path as string}`}
                key={subpage.path}
              >
                <subpage.component
                  trbRequestId={id}
                  trbRequest={trbRequest}
                  requesterString={requesterString}
                  assignLeadModalRef={assignLeadModalRef}
                  assignLeadModalTrbRequestIdRef={
                    assignLeadModalTrbRequestIdRef
                  }
                />
              </Route>
            ))}
          </Grid>
        </Grid>
      </GridContainer>

      <TrbAssignLeadModal
        modalRef={assignLeadModalRef}
        trbRequestIdRef={assignLeadModalTrbRequestIdRef}
      />
    </div>
  );
}
