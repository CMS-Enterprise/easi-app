import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import './index.scss';

type ScrollableTabsProps = {
  tabs: string[];
  children: React.ReactNode | React.ReactNodeArray;
};
const ScrollableTabs = ({ tabs, children }: ScrollableTabsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabListRef: any = useRef(null);
  const [tabListWidth, setTabListWidth] = useState(0);

  useEffect(() => {
    const isScreen = typeof window === 'object';

    if (isScreen) {
      setTabListWidth(tabListRef.current.clientWidth);
    }
  });

  return (
    <div className="easi-scrollable-tabs">
      <ul ref={tabListRef} className="easi-scrollable-tabs__tab-list">
        {tabs.map((tab, index) => (
          <li
            key={tab}
            className={classnames('easi-scrollable-tabs__tab', {
              'easi-scrollable-tabs__tab--selected': selectedIndex === index
            })}
          >
            <button
              type="button"
              className="easi-scrollable-tabs__tab-btn"
              onClick={() => setSelectedIndex(index)}
            >
              <span className="easi-scrollable-tabs__tab-text">{tab}</span>
            </button>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
};

export default ScrollableTabs;
