import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';
import classnames from 'classnames';

import { ATO_STATUS_DUE_SOON_DAYS } from 'constants/systemProfile';
import { AtoStatus } from 'types/systemProfile';
import { formatDateUtc, parseAsUTC } from 'utils/date';

import Tag from '../Tag';

/**
 * Get the ATO Status from a date property
 */
export function getAtoStatus(
  atoExpirationDate: string | null | undefined,
  oaStatus: string | null | undefined
): AtoStatus {
  // override anything else if this system is an OA Member
  if (oaStatus && oaStatus === 'OA Member') {
    return 'Active';
  }

  // No ato if it doesn't exist or invalid empty string
  if (typeof atoExpirationDate !== 'string' || atoExpirationDate === '')
    return 'No ATO';

  const expiry = parseAsUTC(atoExpirationDate).toString();

  const date = new Date().toISOString();

  if (date >= expiry) return 'Expired';

  const soon = parseAsUTC(expiry)
    .minus({ days: ATO_STATUS_DUE_SOON_DAYS })
    .toString();

  if (date >= soon) return 'Due Soon';

  return 'Active';
}

const atoStatusTagClassNames: Record<AtoStatus, string> = {
  Active: 'text-white bg-success-dark',
  'Due Soon': 'bg-warning',
  Expired: 'text-white bg-error-dark',
  'No ATO': 'bg-base-lighter'
};

const atoStatusTagIcon: Record<AtoStatus, React.ComponentType<IconProps>> = {
  Active: Icon.Check,
  'Due Soon': Icon.Warning,
  Expired: Icon.Error,
  'No ATO': Icon.Help
};

export function AtoStatusTag({
  status,
  className
}: {
  status: AtoStatus;
  className?: string;
}) {
  const StatusIcon = atoStatusTagIcon[status];
  return (
    <Tag className={classnames(`${atoStatusTagClassNames[status]}`, className)}>
      <StatusIcon className="margin-right-1" />
      {status}
    </Tag>
  );
}

const atoStatusIconClassNames: Record<AtoStatus, string> = {
  Active: 'text-success',
  'Due Soon': 'text-warning-dark',
  Expired: 'text-error',
  'No ATO': 'text-base-light'
};

const atoStatusIcon: Record<AtoStatus, React.ComponentType<IconProps>> = {
  Active: Icon.CheckCircleOutline,
  'Due Soon': Icon.ErrorOutline,
  Expired: Icon.HighlightOff,
  'No ATO': Icon.HelpOutline
};

export function AtoStatusIconText({
  atoExpirationDate,
  oaStatus
}: {
  atoExpirationDate: string | null | undefined;
  oaStatus: string | null | undefined;
}) {
  const status = getAtoStatus(atoExpirationDate, oaStatus);
  const StatusIcon = atoStatusIcon[status];
  const { t } = useTranslation('systemProfile');
  return (
    <div className="display-flex flex-align-center">
      <StatusIcon
        size={3}
        className={`margin-right-1 ${atoStatusIconClassNames[status]}`}
      />
      <span>
        {t(`systemTable.atoStatusColumn.${status}`)}{' '}
        {formatDateUtc(atoExpirationDate || null, 'MM/yyyy')}
      </span>
    </div>
  );
}
