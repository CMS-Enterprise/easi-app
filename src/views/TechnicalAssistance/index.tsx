import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Homepage from './Homepage';

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
    </Switch>
  );
}

export default TechnicalAssistance;
