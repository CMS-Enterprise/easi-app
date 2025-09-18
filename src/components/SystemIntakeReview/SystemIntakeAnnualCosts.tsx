import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import ReviewRow from 'components/ReviewRow';
import { yesNoMap } from 'data/common';
import { showSystemVal } from 'utils/showVal';

type SystemIntakeAnnualSpendingProps = {
  annualSpending: SystemIntakeFragmentFragment['annualSpending'];
  costs: SystemIntakeFragmentFragment['costs'];
};

/* Conditionally render cost and annual spending information depending on what info is present.
    Original: Display only "costs" info
    Intermediate: Display annual spending info
    Current: Display annual spending and IT portion info
*/
const SystemIntakeAnnualSpending = ({
  annualSpending,
  costs
}: SystemIntakeAnnualSpendingProps) => {
  const { t } = useTranslation('intake');

  const {
    currentAnnualSpending,
    currentAnnualSpendingITPortion,
    plannedYearOneSpending,
    plannedYearOneSpendingITPortion
  } = annualSpending || {};

  const formatDollars = (value: string | null | undefined) =>
    showSystemVal(value, {
      format: val => (Number.isNaN(Number(val)) ? val : `$${val}`)
    });

  const formatPercentage = (value: string | null | undefined) =>
    showSystemVal(value, {
      format: val => (Number.isNaN(Number(val)) ? val : `${val}%`)
    });

  if (currentAnnualSpendingITPortion) {
    return (
      <>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.currentAnnualSpending')} />
            <DescriptionDefinition
              definition={formatDollars(currentAnnualSpending)}
            />
          </div>
          <div>
            <DescriptionTerm
              term={t('review.currentAnnualSpendingITPortion')}
            />
            <DescriptionDefinition
              definition={formatPercentage(currentAnnualSpendingITPortion)}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.plannedYearOneSpending')} />
            <DescriptionDefinition
              definition={formatDollars(plannedYearOneSpending)}
            />
          </div>
          <div>
            <DescriptionTerm
              term={t('review.plannedYearOneSpendingITPortion')}
            />
            <DescriptionDefinition
              definition={formatPercentage(plannedYearOneSpendingITPortion)}
            />
          </div>
        </ReviewRow>
      </>
    );
  }

  // If IT portion field is NOT present but annual spending is - display only annual spending info
  if (currentAnnualSpending) {
    return (
      <>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.currentAnnualSpending')} />
            <DescriptionDefinition
              definition={formatDollars(currentAnnualSpending)}
            />
          </div>
          <div>
            <DescriptionTerm term={t('review.plannedYearOneSpending')} />
            <DescriptionDefinition
              definition={formatDollars(plannedYearOneSpending)}
            />
          </div>
        </ReviewRow>
      </>
    );
  }

  // If IT portion AND annual spending fields are not present - it is an old intake so display legacy cost info
  // TODO: add logic for checking that costs isnt empty here to be safe? diplay error message?
  return (
    <>
      <ReviewRow>
        <div>
          <DescriptionTerm term={t('review.costs')} />
          <DescriptionDefinition
            definition={
              costs?.isExpectingIncrease && yesNoMap[costs.isExpectingIncrease]
            }
          />
        </div>
        {costs?.isExpectingIncrease === 'YES' && (
          <div>
            <DescriptionTerm term={t('review.increase')} />
            <DescriptionDefinition
              definition={formatDollars(costs.expectedIncreaseAmount)}
            />
          </div>
        )}
      </ReviewRow>
    </>
  );
};

export default SystemIntakeAnnualSpending;
