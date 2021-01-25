import React from 'react';

type TabPanelProps = {
  tabName: string;
  children: React.ReactNode;
  isActive?: boolean;
};

/**
 * TabPanel is a compound component. TabPanel MUST BE a direct child of Tabs.
 * The `isActive` prop isn't passed in declaratively. `isActive` is passed
 * from the Tabs render from the React.Children cloneElement.
 */
const TabPanel = ({ tabName, isActive, children }: TabPanelProps) => {
  if (isActive) {
    return <div data-tabname={tabName}>{children}</div>;
  }
  return (
    <div className="easi-only-print" data-tabname={tabName}>
      {children}
    </div>
  );
};

export default TabPanel;
