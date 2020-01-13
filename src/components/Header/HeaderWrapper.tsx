import React from 'react';
import classnames from 'classnames';

type HeaderWrapperProps = {
  className: string;
  children: React.ReactNode;
};
const HeaderWrapper = ({ className, children }: HeaderWrapperProps) => {
  const classNames = classnames('easi-header__wrapper', className);
  return <div className={classNames}>{children}</div>;
};

export default HeaderWrapper;
