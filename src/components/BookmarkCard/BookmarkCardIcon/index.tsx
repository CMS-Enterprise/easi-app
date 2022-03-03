import React from 'react';
import { Button, IconBookmark } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type BookmarkCardIconProps = {
  className?: string;
  color?: 'black' | 'lightgrey';
  size: 'sm' | 'md' | 'lg';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const BookmarkCardIcon = ({
  size,
  color,
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
      lightgrey: color === 'lightgrey'
    },
    {
      black: color === 'black'
    },
    className
  );

  const sizes = () => {
    if (size === 'sm') {
      return 3;
    }
    if (size === 'md') {
      return 5;
    }
    if (size === 'lg') {
      return 7;
    }
    return undefined;
  };

  return (
    <Button onClick={onClick} type="button" unstyled>
      <IconBookmark
        className={classes}
        size={sizes(size)}
        data-testid="bookmark-icon"
        aria-hidden="true"
      />
    </Button>
  );
};

export default BookmarkCardIcon;
