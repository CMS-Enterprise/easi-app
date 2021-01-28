import React from 'react';

type TabPanelProps = {
  id: string;
  tabName: string;
  children: React.ReactNode;
  isActive?: boolean;
};

/**
 * TabPanel is a compound component. TabPanel MUST BE a direct child of Tabs.
 * The `isActive` prop isn't passed in declaratively. `isActive` is passed
 * from the Tabs render from the React.Children cloneElement.
 */
const TabPanel = ({ id, tabName, isActive, children }: TabPanelProps) => {
  if (isActive) {
    return (
      <div
        id={id}
        className="easi-tabs__tab-panel"
        role="tabpanel"
        data-tabname={tabName}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      id={id}
      className="easi-tabs__tab-panel easi-only-print"
      data-tabname={tabName}
    >
      {children}
    </div>
  );
};

export default TabPanel;
