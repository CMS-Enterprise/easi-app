import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import { formatDateUtc } from 'utils/date';

// TODO: Temp status type;
export enum GRBReviewStatus {
  SCHEDULED,
  IN_PROGRESS,
  COMPLETED
}

export type GRBReviewStatusCardProps = {
  grbReviewType: SystemIntakeFragmentFragment['grbReviewType'];
  grbDate?: SystemIntakeFragmentFragment['grbDate'];
  grbReviewStatus: GRBReviewStatus;
  grbReviewStartedAt?: SystemIntakeGRBReviewFragment['grbReviewStartedAt'];
  className?: string;
};

const renderBGColor = (grbReviewStatus: GRBReviewStatus) => {
  if (grbReviewStatus === GRBReviewStatus.COMPLETED) {
    return 'bg-success-lighter';
  }
  return 'bg-primary-lighter';
};

const GRBReviewStatusCard = ({
  grbReviewType,
  grbDate,
  grbReviewStatus,
  grbReviewStartedAt,
  className
}: GRBReviewStatusCardProps) => {
  const { t } = useTranslation('grbReview');

  const isITGovAdmin = useContext(ITGovAdminContext);

  if (!grbReviewStartedAt) {
    return null;
  }

  const StandardCard = (
    <Card
      className={classNames(className)}
      containerProps={{
        className: classNames(
          'margin-0 border-none radius-md',
          renderBGColor(grbReviewStatus)
        )
      }}
    >
      <CardHeader>
        <h3 className="display-inline-block margin-right-2 margin-bottom-0">
          {t('statusCard.standardHeading')}
        </h3>
      </CardHeader>

      <CardBody>
        {/* Status Section */}
        <span
          className={classNames('display-flex', {
            'border-bottom-1px border-primary-light margin-bottom-2 padding-bottom-2':
              grbReviewStatus !== GRBReviewStatus.COMPLETED
          })}
        >
          <h4 className="margin-0 margin-right-1 margin-top-2px">
            {t('statusCard.reviewStatus')}
          </h4>

          <Tag className="bg-white text-base-darker font-body-sm">
            {t(`statusCard.grbReviewStatus.${grbReviewStatus}`)}
          </Tag>
        </span>

        {/* Meeting Details */}
        {grbReviewStatus !== GRBReviewStatus.COMPLETED && (
          <span>
            <h4 className="margin-0 margin-right-1 margin-top-2px margin-bottom-05">
              {t('statusCard.grbMeeting')}
            </h4>

            <div className="easi-body-large">
              {formatDateUtc(grbDate, 'MM/dd/yyyy')}
            </div>

            {isITGovAdmin && (
              <UswdsReactLink
                to="./dates"
                className="usa-button usa-button--outline margin-top-1"
              >
                {t('statusCard.changeMeetingDate')}
              </UswdsReactLink>
            )}
          </span>
        )}
      </CardBody>
    </Card>
  );

  // TODO: Implement AsyncAdmin and AsyncReviewer components
  const AsyncAdmin = <>{t('statusCard.asyncHeading')}</>;
  const AsyncReviewer = <>{t('statusCard.asyncHeading')}</>;

  const renderCard = () => {
    // If the GRB review type is standard, show the standard card for both IT Gov Admin and Reviewer
    if (grbReviewType === SystemIntakeGRBReviewType.STANDARD) {
      return StandardCard;
    }
    // If the GRB review type is async and user id IT Gov Admin
    if (isITGovAdmin) {
      return AsyncAdmin;
    }
    // If the GRB review type is async and user is a reviewer
    return AsyncReviewer;
  };

  return renderCard();
};

export default GRBReviewStatusCard;
