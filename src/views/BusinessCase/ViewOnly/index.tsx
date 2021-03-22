import React from 'react';

import BusinessCaseReview from 'components/BusinessCaseReview';
import PageHeading from 'components/PageHeading';
import { BusinessCaseModel } from 'types/businessCase';

type BusinessCaseViewOnlyProps = {
  businessCase: BusinessCaseModel;
};

const BusinessCaseView = ({ businessCase }: BusinessCaseViewOnlyProps) => (
  <>
    <div className="grid-container">
      <PageHeading>Review your Business Case</PageHeading>
    </div>
    <div className="business-case-review">
      <BusinessCaseReview values={businessCase} />
    </div>
  </>
);

export default BusinessCaseView;
