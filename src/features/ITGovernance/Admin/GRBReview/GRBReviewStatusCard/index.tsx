import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import {
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewType,
  useGetSystemIntakeGRBReviewQuery,
  useGetSystemIntakeQuery
} from 'gql/generated/graphql';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import { formatDateUtc, formatDaysHoursMinutes } from 'utils/date';

// TODO: Temp status type;
export enum GRBReviewStatus {
  SCHEDULED,
  IN_PROGRESS,
  COMPLETED
}

export type GRBReviewStatusCardProps = {
  className?: string;
};

const renderBGColor = (grbReviewStatus: GRBReviewStatus) => {
  if (grbReviewStatus === GRBReviewStatus.COMPLETED) {
    return 'bg-success-lighter';
  }
  return 'bg-primary-lighter';
};

const GRBReviewStatusTag = ({
  grbReviewStatus
}: {
  grbReviewStatus: GRBReviewStatus;
}) => {
  const { t } = useTranslation('grbReview');

  return (
    <span
      className={classNames('display-flex', {
        'border-bottom-1px border-primary-light margin-bottom-2 padding-bottom-2':
          grbReviewStatus !== GRBReviewStatus.COMPLETED
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

const GRBReviewStatusCard = ({ className }: GRBReviewStatusCardProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const isITGovAdmin = useContext(ITGovAdminContext);

  const { days, hours, minutes } = formatDaysHoursMinutes(grbReviewStartedAt);

  const StandardCard = (
    <div
      className={classNames(
        className,
        'padding-3 radius-md',
        renderBGColor(grbReviewStatus)
      )}
    >
      <h3 className="margin-top-0 margin-bottom-2">
        {t('statusCard.standardHeading')}
      </h3>

      {/* Status Section */}
      <GRBReviewStatusTag grbReviewStatus={grbReviewStatus} />

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
    </div>
  );

  const AsyncAdminCard = (
    <div
      className={classNames(
        className,
        'padding-3 radius-md',
        renderBGColor(grbReviewStatus)
      )}
    >
      <h3 className="margin-top-0 margin-bottom-2">
        {t('statusCard.asyncHeading')}
      </h3>

      {/* Status Section */}
      <GRBReviewStatusTag grbReviewStatus={grbReviewStatus} />

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
    </div>
  );
  const AsyncReviewerCard = <>{t('statusCard.asyncHeading')}</>;

  const renderCard = () => {
    // If the GRB review type is standard, show the standard card for both IT Gov Admin and Reviewer
    if (grbReviewType === SystemIntakeGRBReviewType.STANDARD) {
      return StandardCard;
    }
    // If the GRB review type is async and user id IT Gov Admin
    if (isITGovAdmin) {
      return AsyncAdminCard;
    }
    // If the GRB review type is async and user is a reviewer
    return AsyncReviewerCard;
  };

  return renderCard();
};

export default GRBReviewStatusCard;
