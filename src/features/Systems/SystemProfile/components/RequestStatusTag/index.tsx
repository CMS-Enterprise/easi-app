import React from 'react';
import classnames from 'classnames';

import Tag from 'components/Tag';

export type RequestStatusTagClassName = {
  Open: string;
  Closed: string;
};

export type RequestStatus = keyof RequestStatusTagClassName;

export const requestStatusTagClassName: RequestStatusTagClassName = {
  Open: 'bg-accent-cool',
  Closed: 'border-2px'
};

export default ({
  status,
  className
}: {
  status: RequestStatus;
  className?: string;
}) => {
  return (
    <Tag
      className={classnames(
        requestStatusTagClassName[status],
        'display-inline-block',
        className
      )}
    >
      {status}
    </Tag>
  );
};
