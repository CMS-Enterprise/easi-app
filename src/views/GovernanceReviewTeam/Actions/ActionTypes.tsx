import React from 'react';
import { Route } from 'react-router-dom';

const ActionTypes = () => {
  return (
    <>
      <Route
        path="/governance-review-team/:systemId/actions/not-an-it-request"
        render={() => <h1>Not an IT Request</h1>}
      />
      <Route
        path="/governance-review-team/:systemId/actions/test-route"
        render={() => <h1>Test Route</h1>}
      />
    </>
  );
};

export default ActionTypes;
