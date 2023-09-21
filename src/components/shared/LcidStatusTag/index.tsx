import React from 'react';
import { useTranslation } from 'react-i18next';

import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';

import Tag from '../Tag';

export type LcidTagStatus =
  | SystemIntakeLCIDStatus
  | 'EXPIRING_SOON'
  | 'RETIRING_SOON';

export const lcidStatusClassName: Record<LcidTagStatus, string> = {
  ISSUED: 'bg-success-dark text-white',
  RETIRED: 'bg-base-lighter',
  RETIRING_SOON: 'bg-warning',
  EXPIRED: 'bg-secondary-dark text-white',
  EXPIRING_SOON: 'bg-warning'
};

type LcidStatusTagProps = {
  status: LcidTagStatus;
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
