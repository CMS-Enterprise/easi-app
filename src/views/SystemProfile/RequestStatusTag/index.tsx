import React from 'react';
import classnames from 'classnames';

import Tag from 'components/shared/Tag';

export type RequestStatus = {
  Open: string;
  Closed: string;
};

export const requestStatusTagClassName: RequestStatus = {
  Open: 'bg-accent-cool',
  Closed: 'border-2px'
};

export default ({
  status,
  className
}: {
  status: string;
  className?: string;
}) => {
  return (
    <Tag
      className={classnames(
        requestStatusTagClassName[status as keyof RequestStatus],
        'display-inline-block',
        className
      )}
    >
      {status}
    </Tag>
  );
};
