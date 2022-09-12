import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Homepage from './Homepage';

function TechnicalAssistance() {
  const { url } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={url}>
        <Homepage />
      </Route>
      <Route exact path={`${url}/request-type`}>
        <>New Request wip</>
      </Route>
    </Switch>
  );
}

export default TechnicalAssistance;
