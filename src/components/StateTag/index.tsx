import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { SystemIntakeState } from 'gql/generated/graphql';
import { lowerCase } from 'lodash';

import Tag from 'components/Tag';

import './index.scss';

type StateTagProps = { state: 'OPEN' | 'CLOSED'; className?: string };

/**
 * Tag to display open/closed state
 */
const StateTag = ({ state, className }: StateTagProps) => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <Tag
      data-testid="request-state"
      className={classNames('easi-state-tag', className, {
        'text-white bg-info-dark': state === SystemIntakeState.OPEN,
        'bg-base-light': state === SystemIntakeState.CLOSED
      })}
    >
      {t(`status.${lowerCase(state)}`)}
    </Tag>
  );
};

export default StateTag;
