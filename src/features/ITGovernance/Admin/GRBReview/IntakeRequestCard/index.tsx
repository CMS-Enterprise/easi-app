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
import IconLink from 'components/IconLink';
import ReviewRow from 'components/ReviewRow';
import SystemIntakeAnnualSpending from 'components/SystemIntakeReview/SystemIntakeAnnualCosts';
import { formatDateLocal } from 'utils/date';

export type IntakeRequestCardProps = {
  systemIntakeID: string;
  currentStage: SystemIntakeFragmentFragment['currentStage'];
  annualSpending: SystemIntakeFragmentFragment['annualSpending'];
  totalContractCosts: SystemIntakeFragmentFragment['totalContractCosts'];
  submittedAt: SystemIntakeFragmentFragment['submittedAt'];
  className?: string;
};

const IntakeRequestCard = ({
  systemIntakeID,
  currentStage,
  annualSpending,
  totalContractCosts,
  submittedAt,
  className
}: IntakeRequestCardProps) => {
  const { t } = useTranslation('intake');

  return (
    <Card
      className={classNames(className)}
      containerProps={{
        className: 'margin-0 border-width-1px shadow-2 radius-md'
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
            <DescriptionTerm
              className="font-body-sm margin-bottom-0"
              term={t('requestDetails.currentStage')}
            />
            <DescriptionDefinition
              className="font-body-md text-light"
              definition={currentStage}
            />
          </div>
        </ReviewRow>
        <SystemIntakeAnnualSpending
          costs={null}
          annualSpending={annualSpending}
          totalContractCosts={totalContractCosts}
        />
      </CardBody>

      <CardFooter>
        <IconLink
          icon={<Icon.ArrowForward aria-hidden />}
          iconPosition="after"
          to={`/it-governance/${systemIntakeID}/intake-request`}
          className="margin-top-1"
        >
          {t('requestDetails.viewFullIntake')}
        </IconLink>
      </CardFooter>
    </Card>
  );
};

export default IntakeRequestCard;
