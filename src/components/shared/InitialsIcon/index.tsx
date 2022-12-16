import React from 'react';
import classNames from 'classnames';

import './index.scss';

type InitialsIconProps = {
  name: string;
  color?: string;
  className?: string;
};

export default function InitialsIcon({
  name,
  color = 'accent-cool-lighter',
  className
}: InitialsIconProps) {
  // Get array of names, taking into account commas for jr, sr, etc.
  const nameArray = name.split(',')[0].split(' ');

  // Get initials
  const [firstName] = nameArray;
  const [lastName] = nameArray.slice(-1); // Get last name in array
  const initials = (firstName[0] + lastName[0]).toUpperCase();

  return (
    <div className={classNames('easi-initials-icon', `bg-${color}`, className)}>
      <span>{initials}</span>
    </div>
  );
}
