import React from 'react';

import ReviewRow from 'components/ReviewRow';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
} from 'components/shared/DescriptionGroup';
import { BidnessCaseSolution } from 'types/bidnessCase';
import EstimatedLifecycleCostReview from 'components/EstimatedLifecycleCost/Review';

/**
 * Title
 * Summary
 * Pros
 * Cons
 * Estimated Lifecycle
 * Cost Savings
 */

type ReviewProps = {
  solution: BidnessCaseSolution;
};

const AsIsSolutionReview = ({ solution }: ReviewProps) => (
  <div>
    <DescriptionList title="As-Is Solution">
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="“As is” solution: Title" />
          <DescriptionDefinition definition={solution.title} />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="“As is” solution: Summary" />
          <DescriptionDefinition definition={solution.summary} />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="“As is” solution: Pros" />
          <DescriptionDefinition definition={solution.pros} />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="“As is” solution: Cons" />
          <DescriptionDefinition definition={solution.cons} />
        </div>
      </ReviewRow>
    </DescriptionList>
    <ReviewRow>
      <EstimatedLifecycleCostReview data={solution.estimatedLifecycleCost} />
    </ReviewRow>

    <ReviewRow>
      <div className="line-height-body-3">
        <DescriptionTerm term="What is the cost savings or avoidance associated with this solution?" />
        <DescriptionDefinition definition={solution.costSavings} />
      </div>
    </ReviewRow>
  </div>
);

export default AsIsSolutionReview;
