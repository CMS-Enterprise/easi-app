import React, {
  createContext,
  ReactNode,
  ReactNodeArray,
  useContext,
  useState
} from 'react';
import classnames from 'classnames';

import './index.scss';

type SecondaryNavContextType = {
  activeTab: string;
  onTabChange: (tabName: string) => void;
};

const SecondaryNavContext = createContext<SecondaryNavContextType>({
  activeTab: '',
  onTabChange: () => {}
});

type SecondaryNavProps = {
  defaultTab: string;
  children: ReactNode | ReactNodeArray;
  onTabChange?: (tabName: string) => void;
};

const SecondaryNav = ({
  defaultTab,
  children,
  onTabChange
}: SecondaryNavProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <nav aria-label="Secondary Navigation" className="easi-secondary-nav">
      <div className="grid-container">
        <SecondaryNavContext.Provider
          value={{
            activeTab,
            onTabChange: (tabName: string) => {
              setActiveTab(tabName);
              if (onTabChange) {
                onTabChange(tabName);
              }
            }
          }}
        >
          {children}
        </SecondaryNavContext.Provider>
      </div>
    </nav>
  );
};

type NavButtonProps = {
  name: string;
  children: ReactNode | ReactNodeArray;
} & JSX.IntrinsicElements['button'];

const NavButton = ({ name, children, ...props }: NavButtonProps) => {
  const actionContext = useContext(SecondaryNavContext);
  if (!actionContext) {
    throw new Error(
      'This component cannot be used outside of the Secondary Nav Context'
    );
  }

  const classNames = classnames('easi-secondary-nav__nav-btn', {
    'easi-secondary-nav__nav-btn--active': actionContext.activeTab === name
  });

  return (
    <button
      type="button"
      className={classNames}
      onClick={() => {
        actionContext.onTabChange(name);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// type NavLinkProps = {
//   name: string;
//   to: string;
//   children: ReactNode | ReactNodeArray;
// };

// const NavLink = ({ name, to, children }: NavLinkProps) => {
//   const actionContext = useContext(SecondaryNavContext);
//   if (!actionContext) {
//     throw new Error(
//       'This component cannot be used outside of the Secondary Nav Context'
//     );
//   }

//   const classNames = classnames('easi-secondary-nav__nav-link', {
//     'easi-secondary-nav__nav-link': actionContext.activeTab === name
//   });

//   return (
//     <Link to={to} className={classNames}>
//       {children}
//     </Link>
//   );
// };

export { SecondaryNav, NavButton };
