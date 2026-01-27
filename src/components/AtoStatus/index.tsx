import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';
import classnames from 'classnames';

import { AtoStatus } from 'types/systemProfile';
import { formatDateUtc } from 'utils/date';

import Tag from '../Tag';

import getAtoStatus from './getAtoStatus';

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
        aria-hidden
      />
      {oaStatus === 'OA Member' && (
        <span>{t('singleSystem.ato.atoOngoing')}</span>
      )}
      {oaStatus !== 'OA Member' && (
        <span>
          {t(`systemTable.atoStatusColumn.${status}`)}{' '}
          {formatDateUtc(atoExpirationDate || null, 'MM/yyyy')}
        </span>
      )}
    </div>
  );
}
