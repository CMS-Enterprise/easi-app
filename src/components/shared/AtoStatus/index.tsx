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
import { GetSystemProfile_cedarAuthorityToOperate as CedarAuthorityToOperate } from 'queries/types/GetSystemProfile';
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
 * Get the ATO Status from certain date properties and flags.
 */
export function getAtoStatus(
  // eslint-disable-next-line camelcase
  data?: {
    dateAuthorizationMemoExpires: CedarAuthorityToOperate['dateAuthorizationMemoExpires'];
  }
): AtoStatus {
  // `ato.dateAuthorizationMemoExpires` will be null if tlcPhase is Initiate|Develop

  // No ato if it doesn't exist
  if (!data) return 'No ATO';

  const { dateAuthorizationMemoExpires } = data;

  if (!dateAuthorizationMemoExpires) return 'No ATO';

  const expiry = parseAsUTC(dateAuthorizationMemoExpires).toString();

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
