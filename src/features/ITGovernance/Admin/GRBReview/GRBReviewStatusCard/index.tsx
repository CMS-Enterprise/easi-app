import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import IconLink from 'components/IconLink';
import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import { GRBReviewStatus } from 'types/grbReview';
import { formatDateUtc, formatDaysHoursMinutes } from 'utils/date';

import { useRestartReviewModal } from '../RestartReviewModal/RestartReviewModalContext';

import EndGRBAsyncVoting from './EndGRBAsyncVoting';
import ExtendGRBAsyncReview from './ExtendGRBAsyncReview';

type GRBReviewStatusTagProps = {
  systemIntakeId: string;
  isITGovAdmin: boolean;
  grbReviewType: SystemIntakeGRBReviewType;
  grbReviewStatus: GRBReviewStatus;
};

const GRBReviewStatusTag = ({
  systemIntakeId,
  isITGovAdmin,
  grbReviewType,
  grbReviewStatus
}: GRBReviewStatusTagProps) => {
  const { t } = useTranslation('grbReview');
  const { openModal } = useRestartReviewModal();

  const showRestartButton =
    isITGovAdmin &&
    grbReviewType === SystemIntakeGRBReviewType.ASYNC &&
    grbReviewStatus === 'COMPLETED';

  const showSetupButton = isITGovAdmin && grbReviewStatus === 'NOT_STARTED';

  return (
    <div className={classNames('display-flex flex-align-center')}>
      <h4 className="margin-0 margin-right-1 flex-align-self-center">
        {t('statusCard.reviewStatus')}
      </h4>

      <Tag
        data-testid="async-status"
        className="bg-white text-base-darker font-body-sm flex-align-self-center"
      >
        {t(`statusCard.grbReviewStatus.${grbReviewStatus}`)}
      </Tag>

      {showRestartButton && (
        <Button
          type="button"
          unstyled
          onClick={openModal}
          className="margin-left-3"
        >
          {t('statusCard.restartReview')}
          <Icon.ArrowForward aria-hidden />
        </Button>
      )}

      {showSetupButton && (
        <IconLink
          to={`/it-governance/${systemIntakeId}/grb-review/review-type`}
          className="margin-left-3"
          icon={<Icon.ArrowForward aria-hidden />}
          iconPosition="after"
        >
          {t('adminTask.setUpGRBReview.title')}
        </IconLink>
      )}
    </div>
  );
};

export type GRBReviewStatusCardProps = {
  systemIntakeId: string;
  grbReview: SystemIntakeGRBReviewFragment;
  className?: string;
};

const GRBReviewStatusCard = ({
  systemIntakeId,
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

  /**
   * Returns the correct status data for the review type,
   * or NOT_STARTED if status is null
   */
  const grbReviewStatus: GRBReviewStatus | null | undefined = useMemo(() => {
    if (!grbReviewStartedAt) return 'NOT_STARTED';

    return grbReviewType === SystemIntakeGRBReviewType.STANDARD
      ? grbReviewStandardStatus
      : grbReviewAsyncStatus;
  }, [
    grbReviewAsyncStatus,
    grbReviewStandardStatus,
    grbReviewType,
    grbReviewStartedAt
  ]);

  const backgroundColorClass = useMemo(() => {
    switch (grbReviewStatus) {
      case 'COMPLETED':
        return 'bg-success-lighter';

      case 'NOT_STARTED':
        return 'bg-warning-lighter';

      case 'PAST_DUE':
        return 'bg-error-lighter';

      default:
        return 'bg-primary-lighter';
    }
  }, [grbReviewStatus]);

  const reviewIsInProgress: boolean =
    grbReviewStatus !== 'NOT_STARTED' && grbReviewStatus !== 'COMPLETED';

  if (!grbReviewStatus) {
    return null;
  }

  const borderColorClass =
    grbReviewStatus === 'PAST_DUE'
      ? 'border-error-light'
      : 'border-primary-light';

  const dateTextColorClass =
    grbReviewStatus === 'PAST_DUE' ? 'text-error-dark' : 'text-primary-dark';

  return (
    <div
      className={classNames(
        className,
        'padding-3 radius-md',
        backgroundColorClass
      )}
    >
      {grbReviewStatus !== 'NOT_STARTED' && (
        <h3 className="margin-top-0 margin-bottom-2">
          {t('statusCard.heading', { context: grbReviewType })}
        </h3>
      )}

      {/* Status Section */}
      <GRBReviewStatusTag
        systemIntakeId={systemIntakeId}
        grbReviewType={grbReviewType}
        grbReviewStatus={grbReviewStatus}
        isITGovAdmin={isITGovAdmin}
      />

      {/* Meeting Details */}
      {reviewIsInProgress && (
        <div
          className={classNames(
            'border-top-1px margin-top-2 padding-top-2',
            borderColorClass
          )}
        >
          {grbReviewType === SystemIntakeGRBReviewType.ASYNC ? (
            // ASYNC review type
            <>
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

                <p
                  className={classNames(
                    'easi-body-normal margin-0 flex-align-self-center',
                    dateTextColorClass
                  )}
                >
                  {t('statusCard.reviewEnds', {
                    date: formatDateUtc(grbReviewAsyncEndDate, 'MM/dd/yyyy'),
                    context: grbReviewStatus
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
            </>
          ) : (
            // STANDARD meeting type
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GRBReviewStatusCard;
