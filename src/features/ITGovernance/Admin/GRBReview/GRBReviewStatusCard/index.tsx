import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import { formatDateUtc, formatDaysHoursMinutes } from 'utils/date';

import GRBAddTimeModal from './GRBAddTimeModal';

// TODO: Temp status type;
export enum GRBReviewStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export type GRBReviewStatusCardProps = {
  grbReview: SystemIntakeGRBReviewFragment;
  className?: string;
};

const renderBGColor = (
  grbReviewStatus: SystemIntakeGRBReviewAsyncStatusType | null | undefined
) => {
  if (grbReviewStatus === SystemIntakeGRBReviewAsyncStatusType.COMPLETED) {
    return 'bg-success-lighter';
  }
  return 'bg-primary-lighter';
};

const GRBReviewStatusTag = ({
  grbReviewStatus
}: {
  grbReviewStatus:
    | SystemIntakeGRBReviewAsyncStatusType
    | GRBReviewStatus
    | null
    | undefined;
}) => {
  const { t } = useTranslation('grbReview');

  if (!grbReviewStatus) {
    return null;
  }

  return (
    <span
      className={classNames('display-flex', {
        'border-bottom-1px border-primary-light margin-bottom-2 padding-bottom-2':
          grbReviewStatus !== SystemIntakeGRBReviewAsyncStatusType.COMPLETED
      })}
    >
      <h4 className="margin-0 margin-right-1 flex-align-self-center">
        {t('statusCard.reviewStatus')}
      </h4>

      <Tag className="bg-white text-base-darker font-body-sm flex-align-self-center">
        {t(`statusCard.grbReviewStatus.${grbReviewStatus}`)}
      </Tag>
    </span>
  );
};

const GRBReviewStatusCard = ({
  grbReview,
  className
}: GRBReviewStatusCardProps) => {
  const { t } = useTranslation('grbReview');

  const {
    grbReviewType,
    grbReviewAsyncStatus,
    grbDate,
    grbReviewStartedAt,
    grbReviewAsyncEndDate
  } = grbReview;

  const isITGovAdmin = useContext(ITGovAdminContext);

  const { days, hours, minutes } = formatDaysHoursMinutes(
    grbReviewAsyncEndDate
  );

  if (!grbReviewStartedAt) {
    return null;
  }

  const StandardCard = (
    <div
      className={classNames(
        className,
        'padding-3 radius-md',
        renderBGColor(grbReviewAsyncStatus)
      )}
    >
      <h3 className="margin-top-0 margin-bottom-2">
        {t('statusCard.standardHeading')}
      </h3>

      {/* Status Section */}
      {/* TODO: replace with query data */}
      <GRBReviewStatusTag grbReviewStatus={GRBReviewStatus.SCHEDULED} />

      {/* Meeting Details */}
      {/* TODO: !!!! Replace the Standard GRB Review Status field and enum */}
      {grbReviewAsyncStatus !==
        SystemIntakeGRBReviewAsyncStatusType.COMPLETED && (
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
    </div>
  );

  const AsyncCard = (
    <div
      className={classNames(
        className,
        'padding-3 radius-md',
        renderBGColor(grbReviewAsyncStatus)
      )}
    >
      <h3 className="margin-top-0 margin-bottom-2">
        {t('statusCard.asyncHeading')}
      </h3>

      {/* Status Section */}
      <GRBReviewStatusTag grbReviewStatus={grbReviewAsyncStatus} />

      {/* Meeting Details */}
      {grbReviewAsyncStatus !==
        SystemIntakeGRBReviewAsyncStatusType.COMPLETED && (
        <span>
          <h4 className="margin-0 margin-right-1 margin-top-2px margin-bottom-05">
            {t('statusCard.timeRemaining')}
          </h4>

          <span className="display-flex margin-bottom-05">
            <p className="easi-body-large margin-top-0 margin-bottom-05 margin-right-2">
              {t('statusCard.countdown', {
                days,
                hours,
                minutes
              })}
            </p>

            <p className="easi-body-normal text-primary-dark margin-0 flex-align-self-center">
              {t('statusCard.reviewEnds', {
                date: formatDateUtc(grbReviewAsyncEndDate, 'MM/dd/yyyy')
              })}
            </p>
          </span>

          {isITGovAdmin && <GRBAddTimeModal />}
        </span>
      )}
    </div>
  );

  return (
    <>
      {grbReviewType === SystemIntakeGRBReviewType.STANDARD
        ? StandardCard
        : AsyncCard}
    </>
  );
};

export default GRBReviewStatusCard;
