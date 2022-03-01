import React from 'react';

type PrintableTabContentProps = {
  visible: boolean;
  children: JSX.Element;
};

const PrintableTabContent = ({
  visible,
  children
}: PrintableTabContentProps) => {
  if (visible) {
    return children;
  }
  return <div className="easi-only-print">{children}</div>;
};

export default PrintableTabContent;
