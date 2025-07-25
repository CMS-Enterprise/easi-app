import React from 'react';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import EstimatedLifecycleCostReview from 'components/EstimatedLifecycleCost/Review';
import ReviewRow from 'components/ReviewRow';
import { hostingTypeMap } from 'data/businessCase';
import { yesNoMap } from 'data/common';
import { ProposedBusinessCaseSolution } from 'types/businessCase';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { formatDateLocal } from 'utils/date';

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
    <DescriptionList title={name} className="margin-bottom-0">
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Solution Title" />
          <DescriptionDefinition definition={solution.title} />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Summary" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={solution.summary}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Acquisition approach" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={solution.acquisitionApproach}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Target contract award date" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={
              solution.targetContractAwardDate
                ? formatDateLocal(
                    solution.targetContractAwardDate,
                    'MM/dd/yyyy'
                  )
                : 'N/A'
            }
          />
        </div>
        <div className="line-height-body-3">
          <DescriptionTerm term="Target completion date (In production)" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={
              solution.targetCompletionDate
                ? formatDateLocal(solution.targetCompletionDate, 'MM/dd/yyyy')
                : 'N/A'
            }
          />
        </div>
      </ReviewRow>
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
            <DescriptionTerm term="Is it in the process of getting approved?" />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={yesNoMap[solution.security.isBeingReviewed]}
            />
          </div>
        </ReviewRow>
      )}
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Identify your project's alignment with Zero Trust principles?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={
              solution.zeroTrustAlignment ? solution.zeroTrustAlignment : 'N/A'
            }
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
        <div>
          <ReviewRow>
            <div className="line-height-body-3">
              <DescriptionTerm term="Where are you planning to host?" />
              <DescriptionDefinition
                className="text-pre-wrap"
                definition={solution.hosting.location}
              />
            </div>
          </ReviewRow>
          {solution.hosting.cloudStrategy && (
            <ReviewRow>
              <div className="line-height-body-3">
                <DescriptionTerm term="What is your cloud strategy or cloud migration strategy and how will you implement it?" />
                <DescriptionDefinition
                  className="text-pre-wrap"
                  definition={solution.hosting.cloudStrategy}
                />
              </div>
            </ReviewRow>
          )}
          {solution.hosting.cloudServiceType && (
            <ReviewRow>
              <div className="line-height-body-3">
                <DescriptionTerm term="What, if any, type of cloud service are you planning to use for this solution (Iaas, PaaS, SaaS, etc.)?" />
                <DescriptionDefinition
                  className="text-pre-wrap"
                  definition={solution.hosting.cloudServiceType}
                />
              </div>
            </ReviewRow>
          )}
        </div>
      )}

      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Will your solution have a User Interface, be public facing, or involve outside customers?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={yesNoMap[solution.hasUserInterface]}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Will any workforce training requirements arise as a result of this solution?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={solution.workforceTrainingReqs}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Pros" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={solution.pros}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="line-height-body-3">
          <DescriptionTerm term="Cons" />
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
      <ReviewRow className="margin-bottom-0">
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
