import React from 'react';
import classnames from 'classnames';

import './index.scss';

type UserActionListProps = {
  id: string;
  className?: string;
  children: React.ReactNodeArray;
};

type UserActionProps = {
  onClick?: () => void;
  link?: string;
  children: React.ReactNode;
  testId?: string;
};

export const UserActionList = ({
  id,
  className,
  children
}: UserActionListProps) => {
  const classNames = classnames('user-actions-dropdown', className);
  return (
    <ul id={id} className={classNames} data-testid="UserActions-Dropdown">
      {children}
    </ul>
  );
};

export const UserAction = ({
  onClick,
  link,
  children,
  testId
}: UserActionProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    if (link) {
      window.location.href = link;
    }
  };

  return (
    <li className="user-actions-dropdown__item">
      <button type="button" onClick={handleClick} data-testid={testId}>
        {children}
      </button>
    </li>
  );
};
