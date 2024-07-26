import React from 'react';
import {
  IconCheck,
  IconError,
  IconHelp,
  IconWarning
} from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';
import classnames from 'classnames';

import { ATO_STATUS_DUE_SOON_DAYS } from 'constants/systemProfile';
import { AtoStatus } from 'types/systemProfile';
import { parseAsUTC } from 'utils/date';

import Tag from '../Tag';

const atoStatusClassNames: Record<AtoStatus, string> = {
  Active: 'text-white bg-success-dark',
  'Due Soon': 'bg-warning',
  Expired: 'text-white bg-error-dark',
  'No ATO': 'bg-base-lighter'
};

const atoStatusIcon: Record<AtoStatus, React.ComponentType<IconProps>> = {
  Active: IconCheck,
  'Due Soon': IconWarning,
  Expired: IconError,
  'No ATO': IconHelp
};

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

export default function AtoStatusTag({
  status,
  className
}: {
  status: AtoStatus;
  className?: string;
}) {
  const Icon = atoStatusIcon[status];
  return (
    <Tag className={classnames(`${atoStatusClassNames[status]}`, className)}>
      <Icon className="margin-right-1" />
      {status}
    </Tag>
  );
}
