// Context Provider for Navigation Header
// Some sibling components other than header need to call/trigger state changes of the side mobile navigation
// Controls state of header height for fixed scrolling child components

import React, { createContext, useState } from 'react';

type mobileNavProp = boolean;
type navHeightProp = number;

// Create the mobile navigation context for multiple copmponents to be able to toggle
const NavContext = createContext({
  isMobileSideNavExpanded: false,
  setIsMobileSideNavExpanded: (isMobileSideNavExpanded: mobileNavProp) => {},
  navbarHeight: 0,
  setNavbarHeight: (navbarHeight: navHeightProp) => {}
});

// The context provider will be a wrapper that any child components can call to toggle side nav
type childrenProps = {
  children: React.ReactNode;
};

const NavContextProvider = ({ children }: childrenProps) => {
  // the value that will be given to the context
  const [isMobileSideNavExpanded, setIsMobileSideNavExpanded] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  return (
    // the Provider gives access to the context to its children
    <NavContext.Provider
      value={{
        isMobileSideNavExpanded,
        setIsMobileSideNavExpanded,
        navbarHeight,
        setNavbarHeight
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export { NavContext, NavContextProvider };
