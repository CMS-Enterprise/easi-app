import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import { SystemIntakeLCIDStatus } from 'gql/generated/graphql';
import { DateTime } from 'luxon';

import { formatDateLocal } from 'utils/date';

import Tag from '../Tag';

type LcidTagStatus = SystemIntakeLCIDStatus | 'EXPIRING_SOON' | 'RETIRING_SOON';

export const lcidStatusClassName: Record<LcidTagStatus, string> = {
  ISSUED: 'bg-success-dark text-white',
  RETIRED: 'border-2px border-base text-base',
  RETIRING_SOON: 'bg-success-dark text-white',
  EXPIRED: 'bg-secondary-dark text-white',
  EXPIRING_SOON: 'bg-warning'
};

const lcidStatusIcons: Record<LcidTagStatus, React.ElementType> = {
  ISSUED: Icon.Check,
  RETIRED: Icon.History,
  RETIRING_SOON: Icon.Check,
  EXPIRED: Icon.Error,
  EXPIRING_SOON: Icon.Warning
};

type LcidStatusTagProps = {
  lcidStatus: SystemIntakeLCIDStatus;
  lcidExpiresAt: string | null | undefined;
  lcidRetiresAt: string | null | undefined;
};

const LcidStatusTag = ({
  lcidStatus,
  lcidRetiresAt,
  lcidExpiresAt
}: LcidStatusTagProps) => {
  const { t } = useTranslation('action');

  /** Calculate status for tag */
  const status: LcidTagStatus = useMemo(() => {
    // If expired or retired, return status
    if (
      lcidStatus === SystemIntakeLCIDStatus.EXPIRED ||
      lcidStatus === SystemIntakeLCIDStatus.RETIRED
    ) {
      return lcidStatus;
    }

    /** 60 days from now */
    const cutoffDate = DateTime.now().plus({ days: 60 });

    const retiresAtDate = DateTime.fromISO(lcidRetiresAt || '');
    const expiresAtDate = DateTime.fromISO(lcidExpiresAt || '');

    // Check if expiring in less than 60 days
    if (expiresAtDate < cutoffDate) {
      // If retire date is sooner than expire date, return 'RETIRING_SOON'
      if (retiresAtDate < expiresAtDate) {
        return 'RETIRING_SOON';
      }

      return 'EXPIRING_SOON';
    }

    // Check if retiring in less than 60 days
    if (retiresAtDate < cutoffDate) {
      return 'RETIRING_SOON';
    }

    // Return lcidStatus (will be `ACTIVE`)
    return lcidStatus;
  }, [lcidStatus, lcidExpiresAt, lcidRetiresAt]);

  const IconComponent = lcidStatusIcons[status];

  return (
    <div className="display-flex flex-align-center">
      {status === 'RETIRING_SOON' && (
        <span className="text-italic text-base-dark margin-right-2">
          {t('retiringSoonDate', {
            date: formatDateLocal(lcidRetiresAt, 'MM/dd/yyyy')
          })}
        </span>
      )}
      <Tag
        className={`margin-right-0 ${lcidStatusClassName[status]} display-flex`}
        data-testid="lcid-status-tag"
      >
        <IconComponent className="margin-right-1" aria-hidden />
        {t(`lcidStatusTag.${status}`)}
      </Tag>
    </div>
  );
};

export default LcidStatusTag;
