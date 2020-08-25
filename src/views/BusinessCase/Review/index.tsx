import React from 'react';

import BusinessCaseReview from 'components/BusinessCaseReview';
import { BusinessCaseModel } from 'types/businessCase';

type ReviewProps = {
  businessCase: BusinessCaseModel;
};

const Review = ({ businessCase }: ReviewProps) => {
  return (
    <div className="margin-bottom-7">
      <div className="grid-container">
        <h1 className="font-heading-xl margin-top-4">
          Check your answers before sending
        </h1>
      </div>

      <BusinessCaseReview values={businessCase} />
    </div>
  );
};

export default Review;
