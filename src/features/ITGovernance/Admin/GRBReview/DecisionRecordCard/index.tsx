import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GRBVotingInformationStatus,
  SystemIntakeFragmentFragment
} from 'gql/generated/graphql';
import i18next from 'i18next';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import UswdsReactLink from 'components/LinkWrapper';

export type DecisionRecordCardProps = {
  grbVotingInformation: SystemIntakeFragmentFragment['grbVotingInformation'];
  className?: string;
};

const renderBGColor = (votingStatus: GRBVotingInformationStatus) => {
  switch (votingStatus) {
    case GRBVotingInformationStatus.IN_PROGRESS:
      return 'bg-primary-darker';
    case GRBVotingInformationStatus.APPROVED:
      return 'bg-success-darker';
    case GRBVotingInformationStatus.NOT_APPROVED:
      return 'bg-secondary-darker';
    case GRBVotingInformationStatus.INCONCLUSIVE:
      return 'bg-base-dark';
    default:
      return '';
  }
};

const renderBorderColor = (votingStatus: GRBVotingInformationStatus) => {
  switch (votingStatus) {
    case GRBVotingInformationStatus.APPROVED:
      return 'border-success-dark';
    case GRBVotingInformationStatus.NOT_APPROVED:
      return 'border-error-dark';
    case GRBVotingInformationStatus.INCONCLUSIVE:
      return 'border-base';
    default:
      return '';
  }
};

const renderDecisionBanner = (
  votingStatus: GRBVotingInformationStatus,
  systemIntakeID: string
) => {
  let decisionText = '';
  let decisionIcon = <Icon.Help className="margin-right-1" />;

  switch (votingStatus) {
    case GRBVotingInformationStatus.APPROVED:
      decisionText = i18next.t<string>('grbReview:decisionCard.approve');
      decisionIcon = <Icon.CheckCircle className="margin-right-1" />;
      break;
    case GRBVotingInformationStatus.NOT_APPROVED:
      decisionText = i18next.t<string>('grbReview:decisionCard.notApprove');
      decisionIcon = <Icon.Cancel className="margin-right-1" />;
      break;
    case GRBVotingInformationStatus.INCONCLUSIVE:
      decisionText = i18next.t<string>('grbReview:decisionCard.inconclusive');
      decisionIcon = <Icon.Help className="margin-right-1" />;
      break;
    default:
      return '';
  }

  return (
    <div className="display-flex margin-y-1">
      {decisionIcon}
      <div className="flex-align-self-center margin-right-2">
        {decisionText}
      </div>
      <UswdsReactLink
        to={`/it-governance/${systemIntakeID}/resolutions`}
        className="text-white flex-align-self-center"
      >
        {i18next.t<string>('grbReview:decisionCard.issueDecision')}
      </UswdsReactLink>
    </div>
  );
};

const DecisionRecordCard = ({
  grbVotingInformation,
  className
}: DecisionRecordCardProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{ systemId: string }>();

  const voteCommentCount: number =
    grbVotingInformation?.grbReviewers?.filter(
      reviewer => !!reviewer.voteComment?.trim()
    ).length || 0;

  const isITGovAdmin = useContext(ITGovAdminContext);

  if (
    !isITGovAdmin ||
    grbVotingInformation?.votingStatus ===
      GRBVotingInformationStatus.NOT_STARTED
  ) {
    return null;
  }

  return (
    <div
      className={classNames(
        className,
        'radius-md padding-2 text-white',
        renderBGColor(grbVotingInformation.votingStatus)
      )}
    >
      <h4 className="margin-y-1">{t('decisionCard.heading')}</h4>

      <div className="display-flex margin-bottom-1">
        <div className="easi-body-large margin-right-2">
          {t('decisionCard.voteInfo', {
            noObjection: grbVotingInformation.numberOfNoObjection,
            objection: grbVotingInformation.numberOfObjection,
            notVoted: grbVotingInformation.numberOfNotVoted
          })}
        </div>

        <UswdsReactLink
          to="/vote-record"
          className="text-white flex-align-self-center"
        >
          {t('decisionCard.viewVotes')}
        </UswdsReactLink>
      </div>

      <div
        className={classNames('display-flex', {
          'text-primary-light':
            grbVotingInformation.votingStatus ===
            GRBVotingInformationStatus.IN_PROGRESS
        })}
      >
        <Icon.Comment className="margin-right-1" />
        <div className="flex-align-self-center">
          {t('decisionCard.additionalComments', {
            count: voteCommentCount
          })}
        </div>
      </div>

      {grbVotingInformation.votingStatus !==
        GRBVotingInformationStatus.IN_PROGRESS && (
        <>
          <div
            className={classNames(
              'border-bottom-1px margin-y-2',
              renderBorderColor(grbVotingInformation.votingStatus)
            )}
          />

          {renderDecisionBanner(grbVotingInformation.votingStatus, systemId)}
        </>
      )}
    </div>
  );
};

export default DecisionRecordCard;
