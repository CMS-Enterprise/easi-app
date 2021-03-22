import React from 'react';
// eslint-disable-next-line camelcase
import { GetGRTFeedback_grtFeedbacks } from 'queries/types/GetGRTFeedback';

import BusinessCaseReview from 'components/BusinessCaseReview';
import PageHeading from 'components/PageHeading';
import { BusinessCaseModel } from 'types/businessCase';

type BusinessCaseViewOnlyProps = {
  businessCase: BusinessCaseModel;
  // eslint-disable-next-line camelcase
  grtFeedbacks?: GetGRTFeedback_grtFeedbacks[] | null;
};

const BusinessCaseView = ({
  businessCase,
  grtFeedbacks
}: BusinessCaseViewOnlyProps) => (
  <>
    <div className="grid-container">
      <PageHeading>Review your Business Case</PageHeading>
    </div>
    <div className="business-case-review">
      <BusinessCaseReview values={businessCase} grtFeedbacks={grtFeedbacks} />
    </div>
  </>
);

export default BusinessCaseView;
