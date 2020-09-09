import React from 'react';

import './index.scss';

type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => {
  return <div className="easi-page-wrapper">{children}</div>;
};

export default PageWrapper;
