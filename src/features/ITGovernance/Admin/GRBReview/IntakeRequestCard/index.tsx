import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import UswdsReactLink from 'components/LinkWrapper';
import ReviewRow from 'components/ReviewRow';
import { formatDateLocal } from 'utils/date';

export type IntakeRequestCardProps = {
  currentStage: SystemIntakeFragmentFragment['currentStage'];
  annualSpending: SystemIntakeFragmentFragment['annualSpending'];
  submittedAt: SystemIntakeFragmentFragment['submittedAt'];
  className?: string;
};

const IntakeRequestCard = ({
  currentStage,
  annualSpending,
  submittedAt,
  className
}: IntakeRequestCardProps) => {
  const { t } = useTranslation('intake');

  return (
    <Card
      className={classNames(className)}
      containerProps={{
        className: 'margin-0 border-width-1px shadow-2'
      }}
    >
      <CardHeader>
        <h3 className="display-inline-block margin-right-2 margin-bottom-0">
          {t('requestDetails.intakeFormOverview')}
        </h3>
        <span className="margin-right-1 text-base">
          {t('requestDetails.completed', {
            completedDate: formatDateLocal(submittedAt, 'MM/dd/yyyy')
          })}
        </span>
      </CardHeader>

      <CardBody className="padding-top-2">
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('requestDetails.currentStage')} />
            <DescriptionDefinition definition={currentStage} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.currentAnnualSpending')} />
            <DescriptionDefinition
              definition={annualSpending?.currentAnnualSpending}
            />
          </div>
          <div>
            <DescriptionTerm
              term={t('review.currentAnnualSpendingITPortion')}
            />
            <DescriptionDefinition
              definition={annualSpending?.currentAnnualSpendingITPortion}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.plannedYearOneSpending')} />
            <DescriptionDefinition
              definition={annualSpending?.plannedYearOneSpending}
            />
          </div>
          <div>
            <DescriptionTerm
              term={t('review.plannedYearOneSpendingITPortion')}
            />
            <DescriptionDefinition
              definition={annualSpending?.plannedYearOneSpendingITPortion}
            />
          </div>
        </ReviewRow>
      </CardBody>

      <CardFooter>
        <UswdsReactLink to="./intake-request">
          {t('requestDetails.viewFullIntake')}
          <Icon.ArrowForward className="text-middle margin-left-1" />
        </UswdsReactLink>
      </CardFooter>
    </Card>
  );
};

export default IntakeRequestCard;
