import React from 'react';
import classnames from 'classnames';

import Tag from 'components/shared/Tag';

export const requestStatusTagClassName: { [key: string]: string } = {
  Open: 'bg-mint',
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
        requestStatusTagClassName[status],
        'display-inline-block',
        className
      )}
    >
      {status}
    </Tag>
  );
};
