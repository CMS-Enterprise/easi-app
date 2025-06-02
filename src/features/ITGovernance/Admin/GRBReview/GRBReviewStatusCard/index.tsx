import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewStandardStatusType,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import { GRBReviewStatus } from 'types/grbReview';
import { formatDateUtc, formatDaysHoursMinutes } from 'utils/date';

import { useRestartReviewModal } from '../RestartReviewModal/RestartReviewModalContext';

import EndGRBAsyncVoting from './EndGRBAsyncVoting';
import ExtendGRBAsyncReview from './ExtendGRBAsyncReview';

export type GRBReviewStatusCardProps = {
  grbReview: SystemIntakeGRBReviewFragment;
  className?: string;
};

const renderBGColor = (grbReviewStatus: GRBReviewStatus) => {
  if (grbReviewStatus === SystemIntakeGRBReviewAsyncStatusType.COMPLETED) {
    return 'bg-success-lighter';
  }
  return 'bg-primary-lighter';
};

type GRBReviewStatusTagProps = {
  grbReviewStatus: GRBReviewStatus;
};

const GRBReviewStatusTag = ({ grbReviewStatus }: GRBReviewStatusTagProps) => {
  const { t } = useTranslation('grbReview');
  const { openModal } = useRestartReviewModal();

  return (
    <span
      className={classNames('display-flex flex-align-center', {
        'border-bottom-1px border-primary-light margin-bottom-2 padding-bottom-2':
          grbReviewStatus !== SystemIntakeGRBReviewAsyncStatusType.COMPLETED
      })}
    >
      <h4 className="margin-0 margin-right-1 flex-align-self-center">
        {t('statusCard.reviewStatus')}
      </h4>

      <Tag
        data-testid="async-status"
        className="bg-white text-base-darker font-body-sm flex-align-self-center"
      >
        {t(`statusCard.grbReviewStatus.${grbReviewStatus}`)}
      </Tag>

      {grbReviewStatus === SystemIntakeGRBReviewAsyncStatusType.COMPLETED && (
        <Button
          type="button"
          unstyled
          onClick={openModal}
          className="margin-left-3"
        >
          {t('statusCard.restartReview')}
          <Icon.ArrowForward />
        </Button>
      )}
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
    grbReviewStandardStatus,
    grbReviewAsyncStatus,
    grbDate,
    grbReviewStartedAt,
    grbReviewAsyncEndDate,
    grbVotingInformation
  } = grbReview;

  const isITGovAdmin = useContext(ITGovAdminContext);

  const { days, hours, minutes } = formatDaysHoursMinutes(
    grbReviewAsyncEndDate
  );

  /** Returns the correct status data for the review type */
  const grbReviewStatus: GRBReviewStatus | null | undefined =
    grbReviewType === SystemIntakeGRBReviewType.STANDARD
      ? grbReviewStandardStatus
      : grbReviewAsyncStatus;

  if (!grbReviewStartedAt || !grbReviewStatus) {
    return null;
  }

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
      {grbReviewStatus !==
        SystemIntakeGRBReviewStandardStatusType.COMPLETED && (
        <span>
          <h4 className="margin-0 margin-right-1 margin-top-2px margin-bottom-05">
            {t('statusCard.grbMeeting')}
          </h4>

          <div className="easi-body-large">
            {formatDateUtc(grbDate, 'MM/dd/yyyy')}
          </div>

          {isITGovAdmin && (
            <UswdsReactLink
              to={`/it-governance/${grbReview.id}/dates`}
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
        renderBGColor(grbReviewStatus)
      )}
    >
      <h3 className="margin-top-0 margin-bottom-2">
        {t('statusCard.asyncHeading')}
      </h3>

      {/* Status Section */}
      <GRBReviewStatusTag grbReviewStatus={grbReviewStatus} />

      {/* Meeting Details */}
      {grbReviewStatus !== SystemIntakeGRBReviewAsyncStatusType.COMPLETED && (
        <span>
          <h4 className="margin-0 margin-right-1 margin-top-2px margin-bottom-05">
            {t('statusCard.timeRemaining')}
          </h4>

          <Grid row className="margin-bottom-05">
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
          </Grid>

          {isITGovAdmin && (
            <ButtonGroup>
              <ExtendGRBAsyncReview />
              <EndGRBAsyncVoting
                grbReviewAsyncEndDate={grbReviewAsyncEndDate}
                grbVotingInformation={grbVotingInformation}
              />
            </ButtonGroup>
          )}
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
