import React, { useState } from 'react';
import classnames from 'classnames';

import './index.scss';

type TabsProps = {
  defaultActiveTab?: string;
  children: React.ReactElement[];
};

const Tabs = ({ defaultActiveTab, children }: TabsProps) => {
  const tabs = children.map(child => ({
    id: child.props.id,
    name: child.props.tabName
  }));
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0].name);

  return (
    <div className={classnames('easi-tabs')}>
      <div className="easi-tabs__navigation">
        <ul className="easi-tabs__tab-list" role="tablist">
          {tabs.map(tab => (
            <li
              key={tab.id}
              className={classnames('easi-tabs__tab', {
                'easi-tabs__tab--selected': activeTab === tab.name
              })}
              role="tab"
            >
              <button
                type="button"
                className="easi-tabs__tab-btn"
                // aria-selected={activeTab === tab.name}
                aria-controls={tab.id}
                onClick={() => setActiveTab(tab.name)}
              >
                <span className="easi-tabs__tab-text">{tab.name}</span>
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
