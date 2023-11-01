import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { lowerCase } from 'lodash';

import Tag from 'components/shared/Tag';
import { SystemIntakeState } from 'types/graphql-global-types';

type StatusTagProps = { state: SystemIntakeState };

/**
 * Tag to display system intake open/closed status
 */
const StatusTag = ({ state }: StatusTagProps) => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <Tag
      className={classNames('margin-0', {
        'text-white bg-info-dark': state === SystemIntakeState.OPEN,
        'bg-base-light': state === SystemIntakeState.CLOSED
      })}
    >
      {t(`status.${lowerCase(state)}`)}
    </Tag>
  );
};

export default StatusTag;
