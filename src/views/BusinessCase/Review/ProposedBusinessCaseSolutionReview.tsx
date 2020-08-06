import React from 'react';
import EstimatedLifecycleCostReview from 'components/EstimatedLifecycleCost/Review';
import ReviewRow from 'components/ReviewRow';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
} from 'components/shared/DescriptionGroup';
import { hostingTypeMap } from 'data/businessCase';
import { yesNoMap } from 'data/common';
import { ProposedBusinessCaseSolution } from 'types/businessCase';

/**
 * Title
 * Summary
 * Acquisition Approach
 * Hosting Type
 * Hosting Location
 * Hosting Service Type (optional)
 * Has User Interface
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
        <DescriptionTerm term="Do you need to host your solution?" />
        <DescriptionDefinition
          className="text-pre"
          definition={hostingTypeMap[solution.hosting.type]}
        />
      </div>
    </ReviewRow>
    {['cloud', 'dataCenter'].includes(solution.hosting.type) && (
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Where are you planning to host?" />
          <DescriptionDefinition
            className="text-pre"
            definition={solution.hosting.location}
          />
        </div>
        {solution.hosting.cloudServiceType && (
          <div className="line-height-body-3">
            <DescriptionTerm term="What, if any, type of cloud service are you planning to use for this solution (Iaas, PaaS, SaaS, etc.)?" />
            <DescriptionDefinition
              className="text-pre"
              definition={solution.hosting.cloudServiceType}
            />
          </div>
        )}
      </ReviewRow>
    )}
    <ReviewRow>
      <div className="line-height-body-3">
        <DescriptionTerm term="Will your solution have a User Interface?" />
        <DescriptionDefinition
          className="text-pre"
          definition={yesNoMap[solution.hasUserInterface]}
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
