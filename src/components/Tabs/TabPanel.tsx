import React from 'react';
import classnames from 'classnames';

type TabPanelProps = {
  id: string;
  tabName: string;
  children: React.ReactNode;
  isActive?: boolean;
  bordered?: boolean;
};

/**
 * TabPanel is a compound component. TabPanel MUST BE a direct child of Tabs.
 * The `isActive` prop isn't passed in declaratively. `isActive` is passed
 * from the Tabs render from the React.Children cloneElement.
 */
const TabPanel = ({
  id,
  tabName,
  isActive,
  children,
  bordered
}: TabPanelProps) => {
  const classes = classnames('easi-tabs__tab-panel', {
    'easi-only-print': !isActive,
    'easi-tabs__tab-panel--bordered': bordered
  });

  return (
    <section
      id={id}
      role="tabpanel"
      className={classes}
      aria-labelledby={`${id}-tab-btn`}
      data-tabname={tabName}
      data-testid={`${id}-panel`}
      tabIndex={0}
    >
      {children}
    </section>
  );
};

export default TabPanel;
