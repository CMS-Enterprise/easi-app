// Context Provider for Mobile Side Navigation state
// Some sibling components other than header need to call/trigger state changes of the side mobile navigation

import React, { createContext, useState } from 'react';

type NavContextState = boolean;

// create context
const NavContext = createContext({
  isMobileSideNavExpanded: false,
  setIsMobileSideNavExpanded: (isMobileSideNavExpanded: NavContextState) => {}
});

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
