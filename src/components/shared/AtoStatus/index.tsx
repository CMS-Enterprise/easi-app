import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconCheck,
  IconCheckCircleOutline,
  IconError,
  IconErrorOutline,
  IconHelp,
  IconHelpOutline,
  IconHighlightOff,
  IconWarning
} from '@trussworks/react-uswds';
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
export function getAtoStatus(dt: string | null | undefined): AtoStatus {
  // No ato if it doesn't exist or invalid empty string
  if (typeof dt !== 'string' || dt === '') return 'No ATO';

  const expiry = parseAsUTC(dt).toString();

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
  Active: IconCheck,
  'Due Soon': IconWarning,
  Expired: IconError,
  'No ATO': IconHelp
};

export function AtoStatusTag({
  status,
  className
}: {
  status: AtoStatus;
  className?: string;
}) {
  const Icon = atoStatusTagIcon[status];
  return (
    <Tag className={classnames(`${atoStatusTagClassNames[status]}`, className)}>
      <Icon className="margin-right-1" />
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
  Active: IconCheckCircleOutline,
  'Due Soon': IconErrorOutline,
  Expired: IconHighlightOff,
  'No ATO': IconHelpOutline
};

export function AtoStatusIconText({ dt }: { dt: string | null | undefined }) {
  const status = getAtoStatus(dt);
  const Icon = atoStatusIcon[status];
  const { t } = useTranslation('systemProfile');
  return (
    <div className="display-flex flex-align-center">
      <Icon
        size={3}
        className={`margin-right-1 ${atoStatusIconClassNames[status]}`}
      />
      <span>
        {t(`systemTable.atoStatusColumn.${status}`)}{' '}
        {formatDateUtc(dt || null, 'MM/yyyy')}
      </span>
    </div>
  );
}
