import React from 'react';

type PageTemplateProps = {
  className: string;
  children: React.ReactNode;
};

const PageTemplate = ({ className, children }: PageTemplateProps) => {
  return (
    <div className={['page-template', className].join(' ')}>{children}</div>
  );
};

export default PageTemplate;
