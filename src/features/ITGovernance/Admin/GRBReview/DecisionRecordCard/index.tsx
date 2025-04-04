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

type DecisionRenderConfigType = {
  bgColor: string;
  borderColor: string;
  decisionBanner: JSX.Element;
};

// Configures render elements (background color, border color, and decision banner) based on the voting status
const configureDecisionRender = (
  votingStatus: GRBVotingInformationStatus,
  systemIntakeID: string
): DecisionRenderConfigType => {
  const decisionConfig: DecisionRenderConfigType = {
    bgColor: '',
    borderColor: '',
    decisionBanner: <></>
  };
  let decisionText = '';
  let decisionIcon = <Icon.Help className="margin-right-1" />;

  switch (votingStatus) {
    case GRBVotingInformationStatus.IN_PROGRESS:
      decisionConfig.bgColor = 'bg-primary-darker';
      break;
    case GRBVotingInformationStatus.APPROVED:
      decisionConfig.bgColor = 'bg-success-darker';
      decisionConfig.borderColor = 'border-success-dark';
      decisionText = i18next.t<string>('grbReview:decisionCard.approve');
      decisionIcon = <Icon.CheckCircle className="margin-right-1" />;
      break;
    case GRBVotingInformationStatus.NOT_APPROVED:
      decisionConfig.bgColor = 'bg-secondary-darker';
      decisionConfig.borderColor = 'border-error-dark';
      decisionText = i18next.t<string>('grbReview:decisionCard.notApprove');
      decisionIcon = <Icon.Cancel className="margin-right-1" />;
      break;
    case GRBVotingInformationStatus.INCONCLUSIVE:
      decisionConfig.bgColor = 'bg-base-dark';
      decisionConfig.borderColor = 'border-base';
      decisionText = i18next.t<string>('grbReview:decisionCard.inconclusive');
      decisionIcon = <Icon.Help className="margin-right-1" />;
      break;
    default:
      decisionText = '';
  }

  decisionConfig.decisionBanner = (
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

  return decisionConfig;
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

  const decisionConfig = configureDecisionRender(
    grbVotingInformation.votingStatus,
    systemId
  );

  return (
    <div
      className={classNames(
        className,
        'radius-md padding-2 text-white margin-top-2',
        decisionConfig.bgColor
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
          to={`/it-governance/${systemId}/grb-review/decision-record`}
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
              decisionConfig.borderColor
            )}
          />

          {decisionConfig.decisionBanner}
        </>
      )}
    </div>
  );
};

export default DecisionRecordCard;
