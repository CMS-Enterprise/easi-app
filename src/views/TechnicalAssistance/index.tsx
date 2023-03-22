import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import Consult from './AdminHome/Consult';
import RequestEdits from './AdminHome/RequestEdits';
import AdminHome from './AdminHome';
import AdviceLetterForm from './AdviceLetterForm';
import CloseRequest from './CloseRequest';
import Homepage from './Homepage';
import ProcessFlow from './ProcessFlow';
import RequestForm from './RequestForm';
import RequestType from './RequestType';
import TaskList from './TaskList';

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

        {/* Task list after request steps are completed */}
        <Route exact path={`${path}/task-list/:id`}>
          <TaskList />
        </Route>

        {/* Create new or edit exisiting request */}
        <Route exact path={`${path}/requests/:id/:step?/:view?`}>
          <RequestForm />
        </Route>

        <Route path={`${path}/:id/advice/:formStep/:subpage?`}>
          <AdviceLetterForm />
        </Route>

        {/* Admin view */}
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
        <Route exact path={`${path}/:id/:activePage/:action(schedule-consult)`}>
          <Consult />
        </Route>
        <Route exact path={`${path}/:id/:activePage/:action(close-request)`}>
          <CloseRequest />
        </Route>

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
