import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';
import RequestLinkForm from 'views/RequestLinkForm';

import AddNote from './AdminHome/AddNote';
import CloseRequest from './AdminHome/CloseRequest';
import Consult from './AdminHome/Consult';
import TRBRequestInfoWrapper from './AdminHome/RequestContext';
import RequestEdits from './AdminHome/RequestEdits';
import DocumentUpload from './RequestForm/DocumentUpload';
import AdminHome from './AdminHome';
import GuidanceLetterForm from './GuidanceLetterForm';
import Homepage from './Homepage';
import ProcessFlow from './ProcessFlow';
import PublicAdviceLetter from './PublicAdviceLetter';
import RequestForm from './RequestForm';
import RequestType from './RequestType';
import TaskList from './TaskList';
import TrbAttendees from './TrbAttendees';
import TRBDocuments from './TrbDocuments';

import './index.scss';

function TechnicalAssistance() {
  const { path } = useRouteMatch();

  return (
    <MainContent className="technical-assistance margin-bottom-5 desktop:margin-bottom-10">
      <Switch>
        <Route exact path={path}>
          <Homepage />
        </Route>

        {/*
          Starting a New Request begins with selecting a Request Type.
          Existing Requests can update their request type.
        */}
        <Route exact path={[`${path}/start`, `${path}/type/:id?`]}>
          <RequestType />
        </Route>

        {/* Process flow shows info before proceeding to create new request */}
        <Route exact path={`${path}/process`}>
          <ProcessFlow />
        </Route>

        <Route exact path={`${path}/link/:id?`}>
          <RequestLinkForm requestType="trb" />
        </Route>

        {/* Task list after request steps are completed */}
        <Route exact path={`${path}/task-list/:id`}>
          <TaskList />
        </Route>

        {/* Documents table requester view from task list - prepare for TRB meeting */}
        <Route exact path={`${path}/task-list/:id/documents`}>
          <TRBDocuments />
        </Route>

        {/* Documents upload requester view from task list - prepare for TRB meeting */}
        <Route exact path={`${path}/task-list/:id/documents/upload`}>
          <DocumentUpload />
        </Route>

        <Route path={`${path}/task-list/:id/attendees`}>
          <TrbAttendees />
        </Route>

        {/* Public advice letter */}
        <Route exact path={`${path}/guidance-letter/:id`}>
          <PublicAdviceLetter />
        </Route>

        {/* Create new or edit existing request */}
        <Route exact path={`${path}/requests/:id/:step?/:view?`}>
          <RequestForm />
        </Route>

        <Route path={`${path}/:id/guidance/:formStep/:subpage?`}>
          <GuidanceLetterForm />
        </Route>

        {/* Admin view */}
        <TRBRequestInfoWrapper>
          {/* Defining outside parent route to trigger parent rerender/refetch after mutation */}
          <Route path="/trb/:id/additional-information/link">
            <RequestLinkForm requestType="trb" fromAdmin />
          </Route>

          <Route exact path={`${path}/:id/:activePage`}>
            <AdminHome />
          </Route>
          {/* Admin request form actions */}
          <Route
            exact
            path={`${path}/:id/:activePage/:action(request-edits|ready-for-consult)`}
          >
            <RequestEdits />
          </Route>
          <Route
            exact
            path={`${path}/:id/:activePage/:action(schedule-consult)`}
          >
            <Consult />
          </Route>

          <Route exact path={`${path}/:id/notes/add-note`}>
            <AddNote />
          </Route>

          <Route
            exact
            path={`${path}/:id/:activePage/:action(close-request|reopen-request)`}
          >
            <CloseRequest />
          </Route>
        </TRBRequestInfoWrapper>

        <Route path="*">
          <GridContainer className="width-full">
            <NotFoundPartial />
          </GridContainer>
        </Route>
      </Switch>
    </MainContent>
  );
}

export default TechnicalAssistance;
