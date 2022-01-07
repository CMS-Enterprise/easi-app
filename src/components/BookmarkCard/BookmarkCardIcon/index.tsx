import React from 'react';
import classnames from 'classnames';

import './index.scss';

type BookmarkCardIconProps = {
  className?: string;
  black?: boolean;
  lightgrey?: boolean;
  size: 'sm' | 'md' | 'lg';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const BookmarkCardIcon = ({
  size,
  lightgrey,
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
      lightgrey
    },
    {
      black
    },
    className
  );

  return (
    <i
      className={classes}
      onClick={onClick}
      data-testid="bookmark-icon"
      aria-hidden="true"
    />
  );
};

export default BookmarkCardIcon;
