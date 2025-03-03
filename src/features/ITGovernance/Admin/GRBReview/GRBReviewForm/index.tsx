import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';

import { GRBReviewFormStepProps } from 'types/grbReview';

import AdditionalDocumentation from './AdditionalDocumentation';
import ParticipantsAndTimeframe from './ParticipantsAndTimeframe';
import Presentation from './Presentation';
import ReviewType from './ReviewType';

const GRBReviewForm = ({ grbReview }: GRBReviewFormStepProps) => {
  return (
    <Switch>
      <Route path="/it-governance/:systemId/grb-review/:step(review-type)">
        <ReviewType grbReview={grbReview} />
      </Route>

      <Route path="/it-governance/:systemId/grb-review/:step(presentation)">
        <Presentation grbReview={grbReview} />
      </Route>

      <Route path="/it-governance/:systemId/grb-review/:step(documents)">
        <AdditionalDocumentation grbReview={grbReview} />
      </Route>

      <Route path="/it-governance/:systemId/grb-review/:step(participants)">
        <ParticipantsAndTimeframe grbReview={grbReview} />
      </Route>

      <Route path="*">
        <NotFoundPartial />
      </Route>
    </Switch>
  );
};

export default GRBReviewForm;
