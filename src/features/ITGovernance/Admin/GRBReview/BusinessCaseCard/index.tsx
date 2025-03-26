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

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import UswdsReactLink from 'components/LinkWrapper';
import { BusinessCaseModel } from 'types/businessCase';
import { formatDateLocal } from 'utils/date';

export type IntakeRequestCardProps = {
  businessCase: BusinessCaseModel;
  systemIntakeID: string;
  className?: string;
};

const BusinessCaseCard = ({
  businessCase,
  systemIntakeID,
  className
}: IntakeRequestCardProps) => {
  const { t } = useTranslation('grbReview');

  return (
    <Card
      className={classNames(className)}
      containerProps={{
        className: 'margin-0 border-width-1px shadow-2'
      }}
    >
      <CardHeader>
        <h3 className="display-inline-block margin-right-2 margin-bottom-0">
          {t('businessCaseOverview.title')}
        </h3>
        {/* TODO: update these checks to use submittedAt when implemented */}
        {businessCase.id && businessCase.updatedAt && (
          <span className="text-base display-inline-block">
            {t('businessCaseOverview.submitted')}{' '}
            {formatDateLocal(businessCase.updatedAt, 'MM/dd/yyyy')}
          </span>
        )}
      </CardHeader>

      {businessCase.id && businessCase.businessNeed ? (
        <>
          <CardBody>
            <DescriptionList>
              <DescriptionTerm
                term={t('businessCaseOverview.need')}
                className="margin-bottom-0"
              />
              <DescriptionDefinition
                definition={businessCase.businessNeed}
                className="text-light font-body-md line-height-body-4"
              />

              <DescriptionTerm
                term={t('businessCaseOverview.preferredSolution')}
                className="margin-bottom-0 margin-top-2"
              />
              <DescriptionDefinition
                definition={
                  businessCase?.preferredSolution?.summary ||
                  t('businessCaseOverview.noSolution')
                }
                className="text-light font-body-md line-height-body-4"
              />
            </DescriptionList>
          </CardBody>

          <CardFooter>
            <UswdsReactLink
              to={`/it-governance/${systemIntakeID}/business-case`}
              className="display-flex flex-row flex-align-center"
            >
              <span className="margin-right-1">
                {t('businessCaseOverview.linkToBusinessCase')}
              </span>
              <Icon.ArrowForward />
            </UswdsReactLink>
          </CardFooter>
        </>
      ) : (
        <CardBody>
          <Alert type="info" slim>
            {t('businessCaseOverview.unsubmittedAlertText')}
          </Alert>
        </CardBody>
      )}
    </Card>
  );
};

export default BusinessCaseCard;
