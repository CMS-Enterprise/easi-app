import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { SystemIntakeAsyncGRBVotingOption } from 'gql/generated/graphql';

import Tag from 'components/Tag';
import { formatDateUtc } from 'utils/date';

type GRBVoteStatusProps = {
  vote: SystemIntakeAsyncGRBVotingOption;
  dateVoted: string;
  className?: string;
};

const GRBVoteStatus = ({ vote, dateVoted, className }: GRBVoteStatusProps) => {
  const { t } = useTranslation('grbReview');

  return (
    <div className={classNames('display-block', className)}>
      <span className="text-bold margin-right-1">
        {t('reviewTask.voting.youVoted')}
      </span>

      <Tag
        data-testid="vote-tag"
        className={classNames('easi-state-tag text-white', className, {
          'bg-error-dark': vote === SystemIntakeAsyncGRBVotingOption.OBJECTION,
          'bg-success-dark':
            vote === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
        })}
      >
        {t(`reviewTask.voting.${vote}`)}
      </Tag>

      <span className="margin-left-1 text-no-wrap text-base-dark">
        {t('reviewTask.voting.votedOn', {
          date: formatDateUtc(dateVoted, 'MMMM d, yyyy')
        })}
      </span>
    </div>
  );
};

export default GRBVoteStatus;
