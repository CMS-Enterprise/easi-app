import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import { formatDateLocal } from 'utils/date';

export type IntakeRequestCardProps = {
  systemIntakeID: string;
  currentStage: SystemIntakeFragmentFragment['currentStage'];
  annualSpending: SystemIntakeFragmentFragment['annualSpending'];
  submittedAt: SystemIntakeFragmentFragment['submittedAt'];
  className?: string;
};

function IntakeRequestCard({
  systemIntakeID,
  currentStage,
  annualSpending,
  submittedAt,
  className
}: IntakeRequestCardProps) {
  const { t } = useTranslation('grbReview');
  const { t: intakeT } = useTranslation('intake');

  return (
    <Card
      className={classNames(className)}
      containerProps={{
        className: 'margin-0 border-width-1px shadow-2'
      }}
    >
      <CardHeader>
        <h3 className="display-inline-block margin-right-2 margin-bottom-0">
          {intakeT('requestDetails.intakeFormOverview')}
        </h3>
        <span className="margin-right-1 text-base">
          {intakeT('requestDetails.completed', {
            completedDate: formatDateLocal(submittedAt, 'MM/dd/yyyy')
          })}
        </span>
      </CardHeader>
      <CardBody className="padding-top-2">{currentStage}</CardBody>
      <CardFooter>
        <UswdsReactLink to="./intake-request">
          {intakeT('requestDetails.viewFullIntake')}
        </UswdsReactLink>
      </CardFooter>
    </Card>
  );
}

export default IntakeRequestCard;
