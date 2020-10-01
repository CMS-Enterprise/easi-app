import React from 'react';

import { BusinessCaseModel } from 'types/businessCase';

import AlternativeAnalysisReview from './AlternativeAnalysisReview';
import GeneralRequestInfoReview from './GeneralRequestInfoReview';
import RequestDescriptionReview from './RequestDescriptionReview';

type BusinessCaseReviewProps = {
  values: BusinessCaseModel;
};

const BusinessCaseReview = ({ values }: BusinessCaseReviewProps) => {
  return (
    <>
      <div className="grid-container">
        <h2 className="font-heading-xl">General request information</h2>
        <GeneralRequestInfoReview
          values={{
            requestName: values.requestName,
            businessOwner: {
              name: values.businessOwner.name
            },
            requester: {
              name: values.requester.name,
              phoneNumber: values.requester.phoneNumber
            }
          }}
        />

        <h2 className="font-heading-xl margin-top-6">Request description</h2>
        <RequestDescriptionReview
          values={{
            businessNeed: values.businessNeed,
            cmsBenefit: values.cmsBenefit,
            priorityAlignment: values.priorityAlignment,
            successIndicators: values.successIndicators
          }}
        />
      </div>

      <div className="grid-container">
        <h2 className="font-heading-xl margin-top-6 margin-bottom-2">
          Alternatives analysis
        </h2>
      </div>
      <div className="bg-base-lightest padding-top-2 padding-bottom-8">
        <div className="grid-container">
          <AlternativeAnalysisReview
            asIsSolution={values.asIsSolution}
            preferredSolution={values.preferredSolution}
            alternativeA={values.alternativeA}
            alternativeB={values.alternativeB}
          />
        </div>
      </div>
    </>
  );
};

export default BusinessCaseReview;
