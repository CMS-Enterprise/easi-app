import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

import BusinessCaseReview from 'components/BusinessCaseReview';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import { postAction } from 'types/routines';
import { isBusinessCaseFinal } from 'utils/systemIntake';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

import './index.scss';

type ReviewProps = {
  businessCase: BusinessCaseModel;
};

const Review = ({ businessCase }: ReviewProps) => {
  const { t } = useTranslation('businessCase');

  const history = useHistory();
  const dispatch = useDispatch();

  const isSubmitting = useSelector((state: AppState) => state.action.isPosting);
  // TODO: This should use systemIntake.SystemIntakeStep=FINAL_BUSINESS_CASE instead of the overall system intake status=FINAL_BUSINESS_CASE
  // This means this cmoponent will probably need that step passed in as a prop (or the entire intake, whichever makes more sense)
  // https://jiraent.cms.gov/browse/EASI-3440
  const actionType =
    businessCase.systemIntakeStatus === 'BIZ_CASE_FINAL_NEEDED'
      ? 'SUBMIT_FINAL_BIZ_CASE'
      : 'SUBMIT_BIZ_CASE';

  const isFinal = isBusinessCaseFinal(businessCase.systemIntakeStatus);

  return (
    <BusinessCaseStepWrapper
      systemIntakeId={businessCase.systemIntakeId}
      title={t('checkAnswers')}
      className="business-case-review"
      data-testid="business-case-review"
      isFinal={isFinal}
    >
      <BusinessCaseReview values={businessCase} />

      <ButtonGroup className="margin-top-6">
        <Button
          type="button"
          outline
          onClick={() => {
            const newUrl = alternativeSolutionHasFilledFields(
              businessCase.alternativeB
            )
              ? 'alternative-solution-b'
              : 'alternative-solution-a';
            history.push(newUrl);
          }}
        >
          {t('Back')}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            dispatch(
              postAction({
                intakeId: businessCase.systemIntakeId,
                actionType
              })
            );
          }}
        >
          {t('sendBusinessCase')}
        </Button>
      </ButtonGroup>
    </BusinessCaseStepWrapper>
  );
};

export default Review;
