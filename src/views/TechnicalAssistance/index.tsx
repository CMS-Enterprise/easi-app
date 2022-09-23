import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { NotFoundPartial } from 'views/NotFound';

import Homepage from './Homepage';
import RequestForm from './RequestForm';

function TechnicalAssistance() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Homepage />
      </Route>

      <Route exact path={`${path}/request-type`}>
        <>New Request wip</>
      </Route>

      <Route exact path={`${path}/requests/:id/:step?/:view?`}>
        <RequestForm />
      </Route>

      {/* View a request stub */}
      <Route path="*">
        <NotFoundPartial />
      </Route>
    </Switch>
  );
}

export default TechnicalAssistance;
