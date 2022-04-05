import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrepareForGRT from './PrepareForGRT';

const ITGovernance = () => {
  return (
    <div className="grid-container">
      <Switch>
        <Route
          path="/help/it-governance/prepare-for-grt"
          render={() => <PrepareForGRT />}
        />
      </Switch>
    </div>
  );
};

export default ITGovernance;
