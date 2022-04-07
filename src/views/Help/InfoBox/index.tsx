import React from 'react';

export default ({
  heading,
  children
}: {
  heading: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="desktop:grid-col-6 bg-accent-cool-lighter border border-accent-cool-light radius-md padding-3">
      <div className="font-sans-lg line-height-body-1 text-bold margin-bottom-2">
        {heading}
      </div>
      <div className="line-height-body-5">{children}</div>
    </div>
  );
};
