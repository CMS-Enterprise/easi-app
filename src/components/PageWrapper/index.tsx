import React from 'react';
import classnames from 'classnames';

import './index.scss';

type PageWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

const PageWrapper = ({ className, children }: PageWrapperProps) => {
  const classes = classnames('easi-page-wrapper', className);
  return <div className={classes}>{children}</div>;
};

export default PageWrapper;
