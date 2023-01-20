import React from 'react';
import classNames from 'classnames';

type InitialsIconProps = {
  /** Name to use for initials */
  name: string;
  /**
   * Index used to get background color
   *
   * Leave undefined if providing backgroundColor prop
   */
  index?: number;
  /**
   * USWDS background color class to use if index prop is undefined
   *
   * Defaults to bg-primary-lighter
   */
  backgroundColor?: string;
  /** Icon container class */
  className?: string;
};

/** Circle icon that displays user initials  */
export default function InitialsIcon({
  name,
  index = 0,
  backgroundColor = 'bg-primary-lighter',
  className
}: InitialsIconProps) {
  // Split name into array, taking into account commas for jr, sr, etc.
  const nameArray = name.split(',')[0].split(' ');

  // Get initials from nameArray
  const [firstName] = nameArray;
  const [lastName] = nameArray.slice(-1); // Get last name in array
  const initials = (firstName[0] + lastName[0]).toUpperCase();

  /** Array of classes for background colors */
  const colorClassNames: string[] = [
    'bg-accent-cool-lighter',
    'bg-secondary-lighter',
    'bg-accent-warm-lighter',
    'bg-primary-lighter',
    'bg-warning-lighter',
    'bg-success-lighter'
  ];

  /** Icon background color */
  // Use index prop to get corresponding color from array, or default to backgroundColor prop
  const colorClass = index
    ? colorClassNames[index % colorClassNames.length]
    : backgroundColor;

  return (
    <div
      className={classNames(
        `easi-initials-icon display-flex flex-align-center flex-justify-center font-body-2xs circle-4 ${colorClass}`,
        className
      )}
    >
      {initials}
    </div>
  );
}
