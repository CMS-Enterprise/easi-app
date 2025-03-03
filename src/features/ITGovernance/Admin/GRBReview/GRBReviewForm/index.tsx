import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import { SystemIntakeGRBReviewFragment } from 'gql/generated/graphql';

import AdditionalDocumentation from './AdditionalDocumentation';
import ParticipantsAndTimeframe from './ParticipantsAndTimeframe';
import Presentation from './Presentation';
import ReviewType from './ReviewType';

type GRBReviewFormProps = {
  grbReview: SystemIntakeGRBReviewFragment;
};

const GRBReviewForm = ({ grbReview }: GRBReviewFormProps) => {
  return (
    <Switch>
      <Route path="/it-governance/:systemId/grb-review/:step(review-type)">
        <ReviewType grbReviewType={grbReview.grbReviewType} />
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
