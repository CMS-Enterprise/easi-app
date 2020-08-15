import React, { useState } from 'react';

import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import ResponsiveTabs from 'components/shared/ResponsiveTabs';
import { BusinessCaseModel } from 'types/businessCase';
import AsIsSolutionReview from 'views/BusinessCase/Review/AsIsSolutionReview';
import ProposedBusinessCaseSolutionReview from 'views/BusinessCase/Review/ProposedBusinessCaseSolutionReview';

type BusinessCaseReviewProps = {
  values: BusinessCaseModel;
};

const BusinessCaseReview = ({ values }: BusinessCaseReviewProps) => {
  const [activeSolutionTab, setActiveSolutionTab] = useState(
    '"As is" solution'
  );

  const getFilledSolutions = () => {
    const solutions = [
      '"As is" solution',
      'Preferred solution',
      'Alternative A'
    ];
    if (values.alternativeB) {
      solutions.push('Alternative B');
    }
    return solutions;
  };

  return (
    <>
      <div className="grid-container">
        <h2 className="font-heading-xl">General request information</h2>
        <DescriptionList title="General request information">
          <ReviewRow>
            <div>
              <DescriptionTerm term="Request Name" />
              <DescriptionDefinition definition={values.requestName} />
            </div>
            <div>
              <DescriptionTerm term="Business Owner" />
              <DescriptionDefinition definition={values.businessOwner.name} />
            </div>
          </ReviewRow>
          <ReviewRow>
            <div>
              <DescriptionTerm term="Requester" />
              <DescriptionDefinition definition={values.requester.name} />
            </div>
            <div>
              <DescriptionTerm term="Requester Phone Number" />
              <DescriptionDefinition
                definition={values.requester.phoneNumber}
              />
            </div>
          </ReviewRow>
        </DescriptionList>

        <h2 className="font-heading-xl margin-top-6">Request description</h2>
        <DescriptionList title="Request description">
          <ReviewRow>
            <div className="margin-bottom-205 line-height-body-3">
              <DescriptionTerm term="What is your business or user need?" />
              <DescriptionDefinition
                className="text-pre"
                definition={values.businessNeed}
              />
            </div>
          </ReviewRow>
          <ReviewRow>
            <div className="margin-bottom-205 line-height-body-3">
              <DescriptionTerm term="How will CMS benefit from this effort?" />
              <DescriptionDefinition
                className="text-pre"
                definition={values.cmsBenefit}
              />
            </div>
          </ReviewRow>
          <ReviewRow>
            <div className="margin-bottom-205 line-height-body-3">
              <DescriptionTerm term="How does this effort align with organizational priorities?" />
              <DescriptionDefinition
                className="text-pre"
                definition={values.priorityAlignment}
              />
            </div>
          </ReviewRow>
          <ReviewRow>
            <div className="margin-bottom-205 line-height-body-3">
              <DescriptionTerm term="How will you determine whether or not this effort is successful?" />
              <DescriptionDefinition
                className="text-pre"
                definition={values.successIndicators}
              />
            </div>
          </ReviewRow>
        </DescriptionList>
      </div>

      <div className="grid-container">
        <h2 className="font-heading-xl margin-top-6 margin-bottom-2">
          Alternatives analysis
        </h2>
      </div>
      <div className="bg-base-lightest padding-top-2 padding-bottom-8">
        <div className="grid-container">
          <ResponsiveTabs
            activeTab={activeSolutionTab}
            tabs={getFilledSolutions()}
            handleTabClick={tab => {
              setActiveSolutionTab(tab);
            }}
          >
            <div
              className="bg-white easi-business-case__review-solutions-wrapper"
              style={{ overflow: 'auto' }}
            >
              {(tab => {
                switch (tab) {
                  case '"As is" solution':
                    return (
                      <AsIsSolutionReview solution={values.asIsSolution} />
                    );
                  case 'Preferred solution':
                    return (
                      <ProposedBusinessCaseSolutionReview
                        name="Preferred solution"
                        solution={values.preferredSolution}
                      />
                    );
                  case 'Alternative A':
                    return (
                      <ProposedBusinessCaseSolutionReview
                        name="Alternative A"
                        solution={values.alternativeA}
                      />
                    );
                  case 'Alternative B':
                    if (values.alternativeB) {
                      return (
                        <ProposedBusinessCaseSolutionReview
                          name="Alternative B"
                          solution={values.alternativeB}
                        />
                      );
                    }
                    return null;
                  default:
                    return <div />;
                }
              })(activeSolutionTab)}
            </div>
          </ResponsiveTabs>
        </div>
      </div>
    </>
  );
};

export default BusinessCaseReview;
