import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import BusinessCaseReview from 'components/BusinessCaseReview';
import { hasAlternativeB } from 'data/businessCase';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import { postSystemIntakeAction } from 'types/routines';

type ReviewProps = {
  businessCase: BusinessCaseModel;
};

const Review = ({ businessCase }: ReviewProps) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isSubmitting = useSelector(
    (state: AppState) => state.businessCase.isSubmitting
  );

  return (
    <div>
      <div className="grid-container">
        <h1 className="font-heading-xl margin-top-4">
          Check your answers before sending
        </h1>
      </div>

      <BusinessCaseReview values={businessCase} />
      <div className="grid-container margin-top-6">
        <Button
          type="button"
          outline
          onClick={() => {
            const newUrl = hasAlternativeB(businessCase.alternativeB)
              ? 'alternative-solution-b'
              : 'alternative-solution-a';
            history.push(newUrl);
            window.scrollTo(0, 0);
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            // Updating the Intake's status to be BIZ_CASE_DRAFT_SUBMITTED
            dispatch(
              postSystemIntakeAction({
                actionType: 'BIZ_CASE_DRAFT_SUBMITTED',
                intakeId: businessCase.systemIntakeId
              })
            );
          }}
        >
          Send my business case
        </Button>
      </div>
    </div>
  );
};

export default Review;
