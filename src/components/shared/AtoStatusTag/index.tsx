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

import { AtoStatus } from 'types/systemProfile';

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
