import React from 'react';
import classNames from 'classnames';

import { IconProps } from '../IconLink';

import './index.scss';

type IconListItemProps = {
  children: React.ReactNode;
  icon: React.ReactElement<IconProps>;
  className?: string;
};

/** List item with icon, to be used as child of IconList */
export const IconListItem = ({
  children,
  icon,
  className
}: IconListItemProps) => {
  return (
    <li
      className={classNames('usa-icon-list__item flex-align-start', className)}
    >
      <div className="usa-icon-list__icon display-flex flex-align-center">
        {icon}
      </div>
      <div className="usa-icon-list__content">{children}</div>
    </li>
  );
};

type IconListProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Icon list wrapper
 */
export const IconList = ({ children, className }: IconListProps) => {
  return (
    <ul className={classNames('easi-icon-list usa-icon-list', className)}>
      {children}
    </ul>
  );
};
