import React from 'react';

import EstimatedLifecycleCostReview from 'components/EstimatedLifecycleCost/Review';
import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { hostingTypeMap } from 'data/businessCase';
import { yesNoMap } from 'data/common';
import { ProposedBusinessCaseSolution } from 'types/businessCase';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';

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
  fiscalYear: number;
  solution: ProposedBusinessCaseSolution;
};

const PropsedBusinessCaseSolutionReview = ({
  name,
  fiscalYear,
  solution
}: ReviewProps) => (
  <>
    <h3 className="easi-only-print business-case-solution-header">{name}</h3>
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
            className="text-pre-wrap"
            definition={solution.summary}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term={`${name}: Acquisition approach`} />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={solution.acquisitionApproach}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Do you need to host your solution?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={hostingTypeMap[solution.hosting.type]}
          />
        </div>
      </ReviewRow>
      {['cloud', 'dataCenter'].includes(solution.hosting.type) && (
        <ReviewRow>
          <div className="line-height-body-3">
            <DescriptionTerm term="Where are you planning to host?" />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={solution.hosting.location}
            />
          </div>
          {solution.hosting.cloudServiceType && (
            <div className="line-height-body-3">
              <DescriptionTerm term="What, if any, type of cloud service are you planning to use for this solution (Iaas, PaaS, SaaS, etc.)?" />
              <DescriptionDefinition
                className="text-pre-wrap"
                definition={solution.hosting.cloudServiceType}
              />
            </div>
          )}
        </ReviewRow>
      )}
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Is your solution approved by IT Security for use at CMS (FedRAMP, FISMA approved, within the CMS cloud enclave)?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={convertBoolToYesNo(solution.security.isApproved)}
          />
        </div>
      </ReviewRow>
      {!solution.security.isApproved && (
        <ReviewRow>
          <div className="line-height-body-3">
            <DescriptionTerm term="Is your solution in the process of CMS IT Security approval?" />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={yesNoMap[solution.security.isBeingReviewed]}
            />
          </div>
        </ReviewRow>
      )}
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Will your solution have a User Interface?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={yesNoMap[solution.hasUserInterface]}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term={`${name}: Pros`} />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={solution.pros}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term={`${name}: Cons`} />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={solution.cons}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <EstimatedLifecycleCostReview
          fiscalYear={fiscalYear}
          data={solution.estimatedLifecycleCost}
        />
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="What is the cost savings or avoidance associated with this solution?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={solution.costSavings}
          />
        </div>
      </ReviewRow>
    </DescriptionList>
  </>
);

export default PropsedBusinessCaseSolutionReview;
