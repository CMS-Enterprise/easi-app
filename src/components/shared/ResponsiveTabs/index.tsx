import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import classnames from 'classnames';

import './index.scss';

type ResponsiveTabsProps = {
  activeTab: string;
  tabs: string[];
  children: React.ReactNode | React.ReactNodeArray;
  handleTabClick: (tab: string) => void;
};

const ResponsiveTabs = ({
  activeTab,
  tabs,
  children,
  handleTabClick
}: ResponsiveTabsProps) => {
  const [displayedTabs, setDisplayedTabs] = useState(tabs);
  const [moreTabsList, setMoreTabsList] = useState<string[]>([]);
  const [componentWidth, setComponentWidth] = useState(0);
  const [tabListWidth, setTabListWidth] = useState(0);
  const [tabInfo, setTabInfo] = useState<{ name: string; width: number }[]>([]);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const dropdownNode = useRef<any>();
  const moreButtonWidth = 80; // Includes extra pixels for buffer

  const handleClick = (e: Event) => {
    if (
      dropdownNode &&
      dropdownNode.current &&
      dropdownNode.current.contains(e.target)
    ) {
      return;
    }

    setIsMoreMenuOpen(false);
  };

  // Set tabs/widths on component mount
  useEffect(() => {
    const tabElements: any = document.querySelectorAll(
      '.easi-responsive-tabs__tab'
    );
    const arr: { name: string; width: number }[] = [];
    tabElements.forEach((tab: HTMLElement) => {
      arr.push({
        name: tab.innerText,
        width: tab.offsetWidth
      });
    });
    setTabInfo(arr);
  }, []);

  // Set widths and event listners to watch for screen resizing
  useEffect(() => {
    const handleResize = () => {
      const component: any = document.querySelector(
        '.easi-responsive-tabs__navigation'
      );
      const tabList: any = document.querySelector(
        '.easi-responsive-tabs__tab-list'
      );

      setComponentWidth(component.offsetWidth);
      setTabListWidth(tabList.offsetWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Remove tabs when they don't fit
  useLayoutEffect(() => {
    if (componentWidth > 0 && tabListWidth > 0) {
      const tabElements = document.querySelectorAll(
        '.easi-responsive-tabs__tab'
      );
      const availableSpace = componentWidth - moreButtonWidth;
      let updatedTabListWidth = tabListWidth;
      if (availableSpace < updatedTabListWidth) {
        let numberOfTabsToRemove = 0;

        while (availableSpace < updatedTabListWidth) {
          numberOfTabsToRemove += 1;
          updatedTabListWidth -=
            tabElements[tabElements.length - numberOfTabsToRemove].clientWidth;
        }
        if (updatedTabListWidth !== tabListWidth) {
          setTabListWidth(updatedTabListWidth);
        }
        if (numberOfTabsToRemove > 0) {
          setDisplayedTabs(prevTabs =>
            prevTabs.slice(0, prevTabs.length - numberOfTabsToRemove)
          );
          setMoreTabsList(
            tabs.slice(displayedTabs.length - numberOfTabsToRemove, tabs.length)
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabListWidth, componentWidth]);

  // Add tabs when they fit
  useLayoutEffect(() => {
    if (moreTabsList.length > 0) {
      const firstMoreTab = tabInfo.find(
        (tab: any) => tab.name === moreTabsList[0]
      );
      if (
        firstMoreTab &&
        componentWidth >= tabListWidth + firstMoreTab.width + moreButtonWidth
      ) {
        setDisplayedTabs(prevTabs => [...prevTabs, moreTabsList[0]]);
        setMoreTabsList(prevTabs =>
          prevTabs.filter(tab => tab !== moreTabsList[0])
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabListWidth, componentWidth]);

  // Close "More Tabs" menu when it is empty
  useEffect(() => {
    if (moreTabsList.length === 0) {
      setIsMoreMenuOpen(false);
    }
  }, [moreTabsList.length]);

  // Add event listner for closing the "More Tabs" menu
  useEffect(() => {
    document.addEventListener('mouseup', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, []);

  return (
    <div className={classnames('easi-responsive-tabs', 'bg-base-lightest')}>
      <div className="easi-responsive-tabs__navigation">
        <div className="easi-responsive-tabs__tabs-wrapper">
          <ul className="easi-responsive-tabs__tab-list">
            {displayedTabs.map(tab => (
              <li
                key={tab}
                className={classnames('easi-responsive-tabs__tab', {
                  'easi-responsive-tabs__tab--selected': activeTab === tab
                })}
              >
                <button
                  type="button"
                  className="easi-responsive-tabs__tab-btn"
                  onClick={() => handleTabClick(tab)}
                >
                  <span className="easi-responsive-tabs__tab-divider">
                    <span className="easi-responsive-tabs__tab-text">
                      {tab}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div ref={dropdownNode}>
          {moreTabsList.length > 0 && (
            <button
              type="button"
              // ref={dropdownNode}
              className="easi-responsive-tabs__more-btn"
              onClick={() => {
                setIsMoreMenuOpen(prevOpen => !prevOpen);
              }}
              aria-label={
                isMoreMenuOpen
                  ? 'Close More Tabs Menu'
                  : 'Expand More Tabs Menu'
              }
              aria-controls="ResponsiveTabs-MoreMenu"
              aria-expanded={isMoreMenuOpen}
            >
              <i
                className={classnames(
                  'fa',
                  {
                    'fa-angle-right': !isMoreMenuOpen,
                    'fa-angle-down': isMoreMenuOpen
                  },
                  'easi-responsive-tabs__angle-right'
                )}
              />
              <span>More</span>
            </button>
          )}
          {isMoreMenuOpen && (
            <ul
              id="ResponsiveTabs-MoreMenu"
              className="easi-responsive-tabs__more-menu bg-base-lightest"
            >
              {moreTabsList.map(tab => (
                <li key={`menu-tab-${tab}`}>
                  <button
                    type="button"
                    className="easi-responsive-tabs__tab-btn"
                    onClick={() => {
                      handleTabClick(tab);
                      setIsMoreMenuOpen(false);
                    }}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ResponsiveTabs;
