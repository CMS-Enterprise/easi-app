import React from 'react';
import { Button } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type BookmarkCardIconProps = {
  className?: string;
  black?: boolean;
  size: 'sm' | 'md' | 'lg';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const BookmarkCardIcon = ({
  size,
  black,
  className,
  onClick
}: BookmarkCardIconProps) => {
  const classes = classnames(
    'fa',
    'fa-bookmark',
    'bookmark__icon',
    {
      'fa-1x': size === 'sm'
    },
    {
      'fa-2x': size === 'md'
    },
    {
      'fa-3x': size === 'lg'
    },
    {
      black
    },
    className
  );

  return (
    <Button type="button" unstyled onClick={onClick}>
      <i className={classes} data-testid="bookmark-icon" aria-hidden="true" />
    </Button>
  );
};

export default BookmarkCardIcon;
