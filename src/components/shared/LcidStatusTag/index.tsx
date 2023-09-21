import React from 'react';
import { useTranslation } from 'react-i18next';

import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';

import Tag from '../Tag';

export const lcidStatusClassName: Record<SystemIntakeLCIDStatus, string> = {
  ISSUED: 'bg-success-dark text-white',
  // TODO: Update retired/expired status colors
  RETIRED: 'bg-success-dark text-white',
  EXPIRED: 'bg-success-dark text-white'
};

type LcidStatusTagProps = {
  status: SystemIntakeLCIDStatus;
};

const LcidStatusTag = ({ status }: LcidStatusTagProps) => {
  const { t } = useTranslation('action');

  return (
    <Tag
      className={`margin-right-0 ${lcidStatusClassName[status]}`}
      data-testid="lcid-status-tag"
    >
      {t(`lcidStatusTag.${status}`)}
    </Tag>
  );
};

export default LcidStatusTag;
