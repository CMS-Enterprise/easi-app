// Context Provider for Mobile Side Navigation state
// Some sibling components other than header need to call/trigger state changes of the side mobile navigation

import React, { createContext, useState } from 'react';

type NavContextState = boolean;

// Create the mobile navigation context for multiple copmponents to be able to toggle
const NavContext = createContext({
  isMobileSideNavExpanded: false,
  setIsMobileSideNavExpanded: (isMobileSideNavExpanded: NavContextState) => {}
});

// The context provider will be a wrapper that any child components can call to toggle side nav
type childrenProps = {
  children: React.ReactNode;
};

const NavContextProvider = ({ children }: childrenProps) => {
  // the value that will be given to the context
  const [isMobileSideNavExpanded, setIsMobileSideNavExpanded] = useState(false);

  return (
    // the Provider gives access to the context to its children
    <NavContext.Provider
      value={{ isMobileSideNavExpanded, setIsMobileSideNavExpanded }}
    >
      {children}
    </NavContext.Provider>
  );
};

export { NavContext, NavContextProvider };
