import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import classnames from 'classnames';
import './index.scss';

type ScrollableTabsProps = {
  tabs: string[];
  children: React.ReactNode | React.ReactNodeArray;
};

const ScrollableTabs = ({ tabs, children }: ScrollableTabsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
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
      '.easi-scrollable-tabs__tab'
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
        '.easi-scrollable-tabs__navigation'
      );
      const tabList: any = document.querySelector(
        '.easi-scrollable-tabs__tab-list'
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
        '.easi-scrollable-tabs__tab'
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
    <div className="easi-scrollable-tabs">
      <div className="easi-scrollable-tabs__navigation">
        <div className="easi-scrollable-tabs__tabs-wrapper">
          <ul className="easi-scrollable-tabs__tab-list">
            {displayedTabs.map((tab, index) => (
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
                  <span className="easi-scrollable-tabs__tab-divider">
                    <span className="easi-scrollable-tabs__tab-text">
                      {tab}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {moreTabsList.length > 0 && (
          <button
            type="button"
            ref={dropdownNode}
            className="easi-scrollable-tabs__more-btn"
            onClick={() => {
              setIsMoreMenuOpen(true);
            }}
            aria-label={
              isMoreMenuOpen ? 'Close More Tabs Menu' : 'Expand More Tabs Menu'
            }
            aria-controls="ScrollableTabs-MoreMenu"
            aria-expanded={isMoreMenuOpen}
          >
            <i className="fa fa-angle-right easi-scrollable-tabs__angle-right" />
            <span>More</span>
          </button>
        )}
        {isMoreMenuOpen && (
          <ul
            id="ScrollableTabs-MoreMenu"
            className="easi-scrollable-tabs__more-menu"
          >
            {moreTabsList.map(tab => (
              <li key={`menu-tab-${tab}`}>{tab}</li>
            ))}
          </ul>
        )}
      </div>
      {children}
    </div>
  );
};

export default ScrollableTabs;
