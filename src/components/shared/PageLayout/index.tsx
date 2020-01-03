import React from 'react';
import classNames from 'classnames';
import './index.scss';

type PageLayoutProps = {
  className?: string;
  children?: React.ReactNode;
};

const PageLayout = ({ className, children }: PageLayoutProps) => {
  const pageLayoutClasses = classNames('easi-app__layout', className);
  return <main className={pageLayoutClasses}>{children}</main>;
};

export default PageLayout;
