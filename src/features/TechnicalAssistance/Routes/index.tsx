import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';
import EditLinkedSystemsForm from 'features/EditLinkedSystems/EditLinkedSystemsForm';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import RequestLinkForm from 'features/RequestLinking/RequestLinkForm';

import MainContent from 'components/MainContent';

import AdminHome from '../Admin';
import TRBRequestInfoWrapper from '../Admin/_components/RequestContext';
import AddNote from '../Admin/AddNote';
import CloseRequest from '../Admin/CloseRequest';
import Consult from '../Admin/Consult';
import GuidanceLetterForm from '../Admin/GuidanceLetterForm';
import RequestEdits from '../Admin/RequestEdits';
import Homepage from '../Home';
import TrbAttendees from '../Requester/Attendees';
import TRBDocuments from '../Requester/Documents';
import ProcessFlow from '../Requester/ProcessFlow';
import PublicGuidanceLetter from '../Requester/PublicGuidanceLetter';
import RequestForm from '../Requester/RequestForm';
import DocumentUpload from '../Requester/RequestForm/DocumentUpload';
import RequestType from '../Requester/RequestType';
import TaskList from '../Requester/TaskList';

import './index.scss';

function TechnicalAssistance() {
  const { path } = useRouteMatch();

  return (
    <MainContent className="technical-assistance margin-bottom-5 desktop:margin-bottom-10">
      <Switch>
        {/*
        What we now call "Guidance Letter" used to be called "Advice Letter", so we
        create a redirect here to generically handle the advice -> guidance route change (that
        way old emails, bookmarks, and browser history isn't messed up)
        */}
        <Redirect from="*advice*" to="*guidance*" />
        <Redirect from="*recommendations*" to="*insights*" />

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

        {/* Public guidance letter */}
        <Route exact path={`${path}/guidance-letter/:id`}>
          <PublicGuidanceLetter />
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
            <EditLinkedSystemsForm />
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
