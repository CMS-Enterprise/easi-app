import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import Homepage from './Homepage';
import RequestForm from './RequestForm';
import StartRequest from './StartRequest';
import Steps from './Steps';

function TechnicalAssistance() {
  const { path } = useRouteMatch();

  return (
    <MainContent className="technical-assistance margin-bottom-10">
      <Switch>
        <Route exact path={path}>
          <Homepage />
        </Route>

        {/* Start a request; sets `requestType` */}
        <Route exact path={`${path}/start`}>
          <StartRequest />
        </Route>
        <Route exact path={`${path}/steps`}>
          <Steps />
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
