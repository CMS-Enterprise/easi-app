import React from 'react';
import classnames from 'classnames';

import './index.scss';

type PageWrapperProps = {
  className?: string;
  children: React.ReactNode;
} & JSX.IntrinsicElements['div'];

const PageWrapper = ({ className, children, ...props }: PageWrapperProps) => {
  const classes = classnames('easi-page-wrapper', className);
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default PageWrapper;
