import React from 'react';

type MainContentProps = {
  className?: string;
  children: React.ReactNode | React.ReactNodeArray;
};
const MainContent = ({ className, children }: MainContentProps) => {
  return (
    <main id="main-content" className={className} role="main" tabIndex={-1}>
      {children}
    </main>
  );
};

export default MainContent;
