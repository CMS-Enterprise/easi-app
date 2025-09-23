import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import ReviewRow from 'components/ReviewRow';
import { yesNoMap } from 'data/common';
import formatDollars from 'utils/formatDollars';
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

  const formatDollarsString = (value: string | null | undefined) =>
    showSystemVal(value, {
      format: val => {
        const num = Number(val);
        return Number.isNaN(num) ? val : formatDollars(num);
      }
    });

  const formatPercentageString = (value: string | null | undefined) =>
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
              definition={formatDollarsString(currentAnnualSpending)}
            />
          </div>
          <div>
            <DescriptionTerm
              term={t('review.currentAnnualSpendingITPortion')}
            />
            <DescriptionDefinition
              definition={formatPercentageString(
                currentAnnualSpendingITPortion
              )}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.plannedYearOneSpending')} />
            <DescriptionDefinition
              definition={formatDollarsString(plannedYearOneSpending)}
            />
          </div>
          <div>
            <DescriptionTerm
              term={t('review.plannedYearOneSpendingITPortion')}
            />
            <DescriptionDefinition
              definition={formatPercentageString(
                plannedYearOneSpendingITPortion
              )}
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
              definition={formatDollarsString(currentAnnualSpending)}
            />
          </div>
          <div>
            <DescriptionTerm term={t('review.plannedYearOneSpending')} />
            <DescriptionDefinition
              definition={formatDollarsString(plannedYearOneSpending)}
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
              definition={formatDollarsString(costs.expectedIncreaseAmount)}
            />
          </div>
        )}
      </ReviewRow>
    </>
  );
};

export default SystemIntakeAnnualSpending;
