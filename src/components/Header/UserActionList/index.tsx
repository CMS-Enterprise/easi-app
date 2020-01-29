import React from 'react';
import classnames from 'classnames';
import './index.scss';

type UserActionListProps = {
  className?: string;
  children: React.ReactNodeArray;
};

type UserActionProps = {
  onClick?: () => {};
  link?: string;
  children: React.ReactNode;
};

export const UserActionList = ({
  className,
  children
}: UserActionListProps) => {
  const classNames = classnames('user-actions-dropdown', className);
  return <ul className={classNames}>{children}</ul>;
};

export const UserAction = ({ onClick, link, children }: UserActionProps) => {
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
      <button type="button" onClick={handleClick}>
        {children}
      </button>
    </li>
  );
};
