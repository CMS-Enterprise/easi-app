import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import { AppState } from 'stores/reducers/rootReducer';

import BusinessCaseReview from 'components/BusinessCaseReview';
import PageNumber from 'components/PageNumber';
import { BusinessCaseModel } from 'types/businessCase';
import { postAction } from 'types/routines';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

import './index.scss';

type ReviewProps = {
  businessCase: BusinessCaseModel;
  isFinal: boolean;
};

const Review = ({ businessCase, isFinal }: ReviewProps) => {
  const { t } = useTranslation('businessCase');

  const history = useHistory();
  const dispatch = useDispatch();

  const isSubmitting = useSelector((state: AppState) => state.action.isPosting);

  return (
    <BusinessCaseStepWrapper
      systemIntakeId={businessCase.systemIntakeId}
      title={t('checkAnswers')}
      className="business-case-review"
      data-testid="business-case-review"
    >
      <>
        <BusinessCaseReview values={businessCase} />

        <ButtonGroup className="margin-top-6">
          <Button
            type="button"
            outline
            onClick={() => {
              const newUrl = 'alternative-analysis';
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
                  actionType: isFinal
                    ? 'SUBMIT_FINAL_BIZ_CASE'
                    : 'SUBMIT_BIZ_CASE'
                })
              );
            }}
          >
            {t('sendBusinessCase')}
          </Button>
        </ButtonGroup>
      </>

      <PageNumber currentPage={4} totalPages={4} />
    </BusinessCaseStepWrapper>
  );
};

export default Review;
