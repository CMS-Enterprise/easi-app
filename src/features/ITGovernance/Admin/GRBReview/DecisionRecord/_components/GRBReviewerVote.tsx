import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  SystemIntakeAsyncGRBVotingOption,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';

type VoteIconProps = {
  vote: SystemIntakeGRBReviewerFragment['vote'];
  className?: string;
};

/**
 * Renders the correct icon for each vote type
 */
const VoteIcon = ({ vote, className }: VoteIconProps) => {
  switch (vote) {
    case SystemIntakeAsyncGRBVotingOption.OBJECTION:
      return (
        <Icon.Cancel className={classNames('text-error', className)} size={3} />
      );

    case SystemIntakeAsyncGRBVotingOption.NO_OBJECTION:
      return (
        <Icon.CheckCircle
          className={classNames('text-success', className)}
          size={3}
        />
      );

    default:
      return (
        <Icon.Help
          className={classNames('text-base-light', className)}
          size={3}
        />
      );
  }
};

type GRBReviewerVoteProps = {
  grbReviewer: SystemIntakeGRBReviewerFragment;
};

/**
 * Displays the vote information for GRB reviewers
 *
 * Includes a link to view vote comments
 */
const GRBReviewerVote = ({
  grbReviewer: { votingRole, vote, voteComment }
}: GRBReviewerVoteProps) => {
  const { t } = useTranslation('grbReview');

  // Return early if not voting member
  if (votingRole !== SystemIntakeGRBReviewerVotingRole.VOTING) {
    return <></>;
  }

  return (
    <div className="display-flex flex-align-center">
      <p className="margin-0 display-flex flex-align-center width-card padding-right-2">
        <VoteIcon vote={vote} className="margin-right-05" />
        {t('decisionRecord.vote', { context: vote })}
      </p>
      <Button type="button" unstyled onClick={() => null}>
        {t('decisionRecord.viewComment')}
      </Button>
    </div>
  );
};

export default GRBReviewerVote;
