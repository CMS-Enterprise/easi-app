import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

import './index.scss';

type TabsProps = {
  defaultActiveTab?: string;
  children: React.ReactElement[];
};

const DIRECTION: { [key: string]: number } = {
  ArrowLeft: -1,
  ArrowUp: -1,
  ArrowRight: 1,
  ArrowDown: 1
};

const KEYS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_UP: 'ArrowUp',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_DOWN: 'ArrowDown',
  HOME: 'Home',
  END: 'End'
};

// TODO: Responsive Design
// Need to stack tabs and tab panels
// Disable left/right arrows and use up down
// Need to use aria-direction

const Tabs = ({ defaultActiveTab, children }: TabsProps) => {
  const tabsRef = useRef<HTMLUListElement>(null);
  const [tabEls = [], setTabEls] = useState<NodeList>();
  const tabObjs = children.map(child => ({
    id: child.props.id,
    name: child.props.tabName
  }));
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || tabObjs[0].name
  );

  const handleKeyup = (e: KeyboardEvent) => {
    const targetTabIndex = [].indexOf.call(tabEls, e.target);
    let newActiveTab = tabEls[targetTabIndex + DIRECTION[e.key]] as HTMLElement;

    switch (e.key) {
      case KEYS.ARROW_LEFT:
        if (newActiveTab) {
          newActiveTab.focus();
          setActiveTab(newActiveTab.textContent);
        } else {
          newActiveTab = tabEls[tabEls.length - 1] as HTMLElement;
          newActiveTab.focus();
          setActiveTab(newActiveTab.textContent);
        }
        break;
      case KEYS.ARROW_RIGHT:
        if (newActiveTab) {
          newActiveTab.focus();
          setActiveTab(newActiveTab.textContent);
        } else {
          newActiveTab = tabEls[0] as HTMLElement;
          newActiveTab.focus();
          setActiveTab(newActiveTab.textContent);
        }
        break;
      default:
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    let newActiveTab;

    switch (e.key) {
      case KEYS.HOME:
        e.preventDefault();
        // eslint-disable-next-line prefer-destructuring
        newActiveTab = tabEls[0] as HTMLElement;
        if (newActiveTab) {
          newActiveTab.focus();
          setActiveTab(newActiveTab.textContent);
        }
        break;
      case KEYS.END:
        e.preventDefault();
        // eslint-disable-next-line prefer-destructuring
        newActiveTab = tabEls[tabEls.length - 1] as HTMLElement;
        if (newActiveTab) {
          newActiveTab.focus();
          setActiveTab(newActiveTab.textContent);
        }
        break;
      default:
    }
  };

  useEffect(() => {
    if (tabsRef) {
      const newTabs = tabsRef?.current?.querySelectorAll('[role="tab"]');
      setTabEls(newTabs);
    }
  }, [tabsRef]);

  useEffect(() => {
    const tabsEl = tabsRef.current;
    tabsEl?.addEventListener('keyup', handleKeyup);
    tabsEl?.addEventListener('keydown', handleKeydown);

    return () => {
      tabsEl?.removeEventListener('keyup', handleKeyup);
      tabsEl?.removeEventListener('keydown', handleKeydown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabEls]);

  return (
    <div className={classnames('easi-tabs')} data-testid="easi-tabs">
      <ul className="easi-tabs__tab-list" role="tablist" ref={tabsRef}>
        {tabObjs.map(tab => {
          const { id, name } = tab;
          return (
            <li
              key={id}
              className={classnames('easi-tabs__tab', {
                'easi-tabs__tab--selected': activeTab === name
              })}
              role="presentation"
              data-testid={`${id}-tab`}
            >
              <button
                id={`${id}-tab-btn`}
                type="button"
                role="tab"
                className="easi-tabs__tab-btn"
                aria-selected={activeTab === name}
                tabIndex={activeTab === name ? undefined : -1}
                aria-controls={id}
                onClick={() => setActiveTab(name)}
                data-testid={`${id}-tab-btn`}
              >
                <span className="easi-tabs__tab-text">{name}</span>
              </button>
            </li>
          );
        })}
      </ul>
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
