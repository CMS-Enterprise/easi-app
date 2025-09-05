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
        <Icon.Cancel
          className={classNames('text-error', className)}
          data-testid="icon-Cancel"
          size={3}
          aria-hidden
        />
      );

    case SystemIntakeAsyncGRBVotingOption.NO_OBJECTION:
      return (
        <Icon.CheckCircle
          className={classNames('text-success', className)}
          data-testid="icon-CheckCircle"
          size={3}
          aria-hidden
        />
      );

    default:
      return (
        <Icon.Help
          className={classNames('text-base-light', className)}
          data-testid="icon-Help"
          size={3}
          aria-hidden
        />
      );
  }
};

type GRBReviewerVoteProps = {
  grbReviewer: SystemIntakeGRBReviewerFragment;
  /**
   * Set GRB reviewer and open modal on "View comment" button click
   *
   * Omit to hide "View comment" button
   */
  setGRBReviewerViewComment?: (
    grbReviewer: SystemIntakeGRBReviewerFragment | null
  ) => void;
};

/**
 * Displays the vote information for GRB reviewers
 *
 * Includes a link to view vote comments
 */
const GRBReviewerVote = ({
  grbReviewer,
  setGRBReviewerViewComment
}: GRBReviewerVoteProps) => {
  const { t } = useTranslation('grbReview');

  const { votingRole, vote, voteComment } = grbReviewer;

  // Return early if not voting member
  if (votingRole !== SystemIntakeGRBReviewerVotingRole.VOTING) {
    return <></>;
  }

  return (
    <div
      className="display-flex flex-align-center"
      data-testid="grbReviewerVote"
    >
      <p
        className={classNames(
          'margin-0 display-flex flex-align-center font-body-sm',
          {
            'width-card padding-right-2':
              voteComment && setGRBReviewerViewComment
          }
        )}
      >
        <VoteIcon vote={vote} className="margin-right-1" />
        {t('decisionRecord.vote', { context: vote })}
      </p>
      {voteComment && setGRBReviewerViewComment && (
        <Button
          type="button"
          unstyled
          onClick={() => setGRBReviewerViewComment(grbReviewer)}
        >
          {t('decisionRecord.viewComment')}
        </Button>
      )}
    </div>
  );
};

export default GRBReviewerVote;
