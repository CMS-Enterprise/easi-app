import React from 'react';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch
} from 'react-router-dom';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import Homepage from './Homepage';
import RequestForm from './RequestForm';
import StartRequest from './StartRequest';
import Steps from './Steps';

/**
 * Check for `requestType` to be set in location state or else redirect to `/trb/start`.
 */
function RequestTypeRequired({ children }: { children: React.ReactNode }) {
  const { state } = useLocation<{ requestType: string }>();
  const requestType = state?.requestType;
  if (!requestType) return <Redirect to="/trb/start" />;
  return <>{children}</>;
}

function TechnicalAssistance() {
  const { path } = useRouteMatch();

  return (
    <MainContent className="technical-assistance margin-bottom-10">
      <Switch>
        <Route exact path={path}>
          <Homepage />
        </Route>

        {/* Start a request */}
        <Route exact path={`${path}/start`}>
          <StartRequest />
        </Route>

        {/* Start request steps that require `requestType` to be set */}
        <Route exact path={`${path}/steps`}>
          <RequestTypeRequired>
            <Steps />
          </RequestTypeRequired>
        </Route>

        {/* Create new or edit exisiting request */}
        <Route exact path={`${path}/requests/:id/:step?/:view?`}>
          <RequestForm />
        </Route>

        <Route path="*">
          <NotFoundPartial />
        </Route>
      </Switch>
    </MainContent>
  );
}

export default TechnicalAssistance;
