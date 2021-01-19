import React from 'react';

import BusinessCaseReview from 'components/BusinessCaseReview';
import { BusinessCaseModel } from 'types/businessCase';

type BusinessCaseViewOnlyProps = {
  businessCase: BusinessCaseModel;
};

const BusinessCaseView = ({ businessCase }: BusinessCaseViewOnlyProps) => (
  <>
    <div className="grid-container">
      <h1>Review your Business Case</h1>
    </div>
    <div className="business-case-review">
      <BusinessCaseReview values={businessCase} />
    </div>
  </>
);

export default BusinessCaseView;
