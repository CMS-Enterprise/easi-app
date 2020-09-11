import React from 'react';
import classnames from 'classnames';

import './index.scss';

type MainContentProps = {
  className?: string;
  children: React.ReactNode | React.ReactNodeArray;
};
const MainContent = ({ className, children }: MainContentProps) => {
  const classes = classnames('easi-main-content', className);

  return (
    <main id="main-content" className={classes} role="main" tabIndex={-1}>
      {children}
    </main>
  );
};

export default MainContent;
