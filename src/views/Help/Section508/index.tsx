import React from 'react';
import { Route, Switch } from 'react-router-dom';

import StepsInvolved from './StepsInvolved';

const Section508 = () => {
  return (
    <div className="grid-container">
      <Switch>
        <Route
          path="/help/section-508/steps-involved"
          render={() => <StepsInvolved />}
        />
      </Switch>
    </div>
  );
};

export default Section508;
