import React from 'react';
import { useQuery } from '@apollo/client';

import BusinessCaseReview from 'components/BusinessCaseReview';
import PageHeading from 'components/PageHeading';
import GetGovernanceRequestFeedbackQuery from 'queries/GetGovernanceRequestFeedbackQuery';
import {
  GetGovernanceRequestFeedback,
  GetGovernanceRequestFeedbackVariables
} from 'queries/types/GetGovernanceRequestFeedback';
import { BusinessCaseModel } from 'types/businessCase';

type BusinessCaseViewOnlyProps = {
  businessCase: BusinessCaseModel;
};

const BusinessCaseView = ({ businessCase }: BusinessCaseViewOnlyProps) => {
  const { data: grtFeedbackPayload } = useQuery<
    GetGovernanceRequestFeedback,
    GetGovernanceRequestFeedbackVariables
  >(GetGovernanceRequestFeedbackQuery, {
    variables: {
      intakeID: businessCase.systemIntakeId
    }
  });

  const grtFeedbacks =
    grtFeedbackPayload?.systemIntake?.governanceRequestFeedbacks;

  return (
    <>
      <div className="grid-container">
        <PageHeading>Review your Business Case</PageHeading>
      </div>
      <div className="business-case-review">
        <BusinessCaseReview values={businessCase} grtFeedbacks={grtFeedbacks} />
      </div>
    </>
  );
};

export default BusinessCaseView;
