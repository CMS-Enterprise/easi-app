import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GRBVotingInformationStatus,
  SystemIntakeGRBReviewFragment
} from 'gql/generated/graphql';
import i18next from 'i18next';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import UswdsReactLink from 'components/LinkWrapper';

import './index.scss';

export type DecisionRecordCardProps = {
  grbVotingInformation: SystemIntakeGRBReviewFragment['grbVotingInformation'];
  className?: string;
};

type DecisionRenderConfigType = {
  bgColor: string;
  borderColor: string;
  decisionBanner: JSX.Element;
};

/** Configures render elements (background color, border color, and decision banner) based on the voting status */
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
  let decisionIcon = <Icon.Help className="margin-right-1" aria-hidden />;

  switch (votingStatus) {
    case GRBVotingInformationStatus.IN_PROGRESS:
      decisionConfig.bgColor = 'bg-primary-darker';
      break;
    case GRBVotingInformationStatus.APPROVED:
      decisionConfig.bgColor = 'bg-success-darker';
      decisionConfig.borderColor = 'border-success-dark';
      decisionText = i18next.t<string>('grbReview:decisionCard.approve');
      decisionIcon = (
        <Icon.CheckCircle className="margin-right-1" aria-hidden />
      );
      break;
    case GRBVotingInformationStatus.NOT_APPROVED:
      decisionConfig.bgColor = 'bg-secondary-darker';
      decisionConfig.borderColor = 'border-error-dark';
      decisionText = i18next.t<string>('grbReview:decisionCard.notApprove');
      decisionIcon = <Icon.Cancel className="margin-right-1" aria-hidden />;
      break;
    case GRBVotingInformationStatus.INCONCLUSIVE:
      decisionConfig.bgColor = 'bg-base-dark';
      decisionConfig.borderColor = 'border-base';
      decisionText = i18next.t<string>('grbReview:decisionCard.inconclusive');
      decisionIcon = <Icon.Help className="margin-right-1" aria-hidden />;
      break;
    default:
      decisionText = '';
  }

  decisionConfig.decisionBanner = (
    <div
      className={classNames(
        'decision-banner display-flex padding-top-2 margin-top-2 border-top-1px line-height-body-5',
        decisionConfig.borderColor
      )}
    >
      {decisionIcon}
      <p className="margin-y-0 margin-right-3">{decisionText}</p>
      <UswdsReactLink
        to={`/it-governance/${systemIntakeID}/resolutions`}
        className="text-white"
      >
        {i18next.t<string>('grbReview:decisionCard.issueDecision')}
      </UswdsReactLink>
    </div>
  );

  return decisionConfig;
};

/** Displays summary of voting and decision record information */
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
        'decision-record-card radius-md padding-3 text-white margin-top-2',
        decisionConfig.bgColor
      )}
    >
      <h4 className="margin-y-0">{t('decisionCard.heading')}</h4>

      <div className="display-flex margin-y-05">
        <p className="easi-body-large margin-right-3 margin-y-0">
          {t('decisionCard.voteInfo', {
            noObjection: grbVotingInformation.numberOfNoObjection,
            objection: grbVotingInformation.numberOfObjection,
            notVoted: grbVotingInformation.numberOfNotVoted
          })}
        </p>

        <UswdsReactLink
          to={`/it-governance/${systemId}/grb-review/decision-record`}
          className="text-white flex-align-self-center"
        >
          {t('decisionCard.viewVotes')}
        </UswdsReactLink>
      </div>

      <p
        className={classNames('display-flex flex-align-center margin-y-0', {
          'text-primary-light':
            grbVotingInformation.votingStatus ===
            GRBVotingInformationStatus.IN_PROGRESS
        })}
      >
        <Icon.Comment className="margin-right-1" aria-hidden />
        {t('decisionCard.additionalComments', {
          count: voteCommentCount
        })}
      </p>

      {
        // Decision banner for admin view only
        isITGovAdmin &&
          grbVotingInformation.votingStatus !==
            GRBVotingInformationStatus.IN_PROGRESS &&
          decisionConfig.decisionBanner
      }
    </div>
  );
};

export default DecisionRecordCard;
