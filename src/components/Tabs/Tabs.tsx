import React, { useState } from 'react';
import classnames from 'classnames';

import './index.scss';

type TabsProps = {
  defaultActiveTab?: string;
  children: React.ReactElement[];
};

const Tabs = ({ defaultActiveTab, children }: TabsProps) => {
  const tabs = children.map(child => child.props.tabName);
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]);

  return (
    <div className={classnames('easi-tabs')}>
      <div className="easi-tabs__navigation">
        <ul className="easi-tabs__tab-list">
          {tabs.map(tab => (
            <li
              key={tab}
              className={classnames('easi-tabs__tab', {
                'easi-tabs__tab--selected': activeTab === tab
              })}
            >
              <button
                type="button"
                className="easi-tabs__tab-btn"
                onClick={() => setActiveTab(tab)}
              >
                <span className="easi-tabs__tab-text">{tab}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {React.Children.map(children, child => {
        if (child.props.tabName === activeTab) {
          return React.cloneElement(child, {
            isActive: true
          });
        }
        return child;
      })}
    </div>
  );
};

export default Tabs;
