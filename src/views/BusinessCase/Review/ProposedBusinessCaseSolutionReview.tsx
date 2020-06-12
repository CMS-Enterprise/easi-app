import React from 'react';
import EstimatedLifecycleCostReview from 'components/EstimatedLifecycleCost/Review';
import ReviewRow from 'components/ReviewRow';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
} from 'components/shared/DescriptionGroup';
import { ProposedBusinessCaseSolution } from 'types/businessCase';

/**
 * Title
 * Summary
 * Acquisition Approach
 * Pros
 * Cons
 * Estimated Lifecycle
 * Cost Savings
 */

type ReviewProps = {
  name: string;
  solution: ProposedBusinessCaseSolution;
};

const PropsedBusinessCaseSolutionReview = ({ name, solution }: ReviewProps) => (
  <DescriptionList title={name}>
    <ReviewRow>
      <div className="line-height-body-3">
        <DescriptionTerm term={`${name}: Title`} />
        <DescriptionDefinition definition={solution.title} />
      </div>
    </ReviewRow>
    <ReviewRow>
      <div className="line-height-body-3">
        <DescriptionTerm term={`${name}: Summary`} />
        <DescriptionDefinition
          className="text-pre"
          definition={solution.summary}
        />
      </div>
    </ReviewRow>
    <ReviewRow>
      <div className="line-height-body-3">
        <DescriptionTerm term={`${name}: Acquisition approach`} />
        <DescriptionDefinition
          className="text-pre"
          definition={solution.acquisitionApproach}
        />
      </div>
    </ReviewRow>
    <ReviewRow>
      <div className="line-height-body-3">
        <DescriptionTerm term={`${name}: Pros`} />
        <DescriptionDefinition
          className="text-pre"
          definition={solution.pros}
        />
      </div>
    </ReviewRow>
    <ReviewRow>
      <div className="line-height-body-3">
        <DescriptionTerm term={`${name}: Cons`} />
        <DescriptionDefinition
          className="text-pre"
          definition={solution.cons}
        />
      </div>
    </ReviewRow>
    <ReviewRow>
      <EstimatedLifecycleCostReview data={solution.estimatedLifecycleCost} />
    </ReviewRow>
    <ReviewRow>
      <div className="line-height-body-3">
        <DescriptionTerm term="What is the cost savings or avoidance associated with this solution?" />
        <DescriptionDefinition
          className="text-pre"
          definition={solution.costSavings}
        />
      </div>
    </ReviewRow>
  </DescriptionList>
);

export default PropsedBusinessCaseSolutionReview;
