import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotFoundPartial } from 'views/NotFound';

import AdditionalDocumentation from './AdditionalDocumentation';
import ParticipantsAndTimeframe from './ParticipantsAndTimeframe';
import Presentation from './Presentation';
import ReviewType from './ReviewType';

const GRBReviewForm = () => {
  return (
    <Switch>
      <Route path="/it-governance/:systemId/grb-review/:step(review-type)">
        <ReviewType />
      </Route>

      <Route path="/it-governance/:systemId/grb-review/:step(presentation)">
        <Presentation />
      </Route>

      <Route path="/it-governance/:systemId/grb-review/:step(documents)">
        <AdditionalDocumentation />
      </Route>

      <Route path="/it-governance/:systemId/grb-review/:step(participants)">
        <ParticipantsAndTimeframe />
      </Route>

      <Route path="*">
        <NotFoundPartial />
      </Route>
    </Switch>
  );
};

export default GRBReviewForm;
