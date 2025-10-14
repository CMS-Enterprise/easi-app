import React from 'react';

type SystemProfileFormWrapperProps = {
  children: React.ReactNode;
};

const SystemProfileFormWrapper = ({
  children
}: SystemProfileFormWrapperProps) => {
  return <div>{children}</div>;
};

export default SystemProfileFormWrapper;
