import React, { useContext, useEffect, useRef, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Grid } from '@trussworks/react-uswds';

import { NavContext } from 'components/Header/navContext';
import NavigationBar from 'components/NavigationBar';
import ServiceAlert from 'components/ServiceAlert';
import { localAuthStorageKey } from 'constants/localAuth';

import '../../components/Header/index.scss';
import './index.scss';

type NavigationProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const Navigation = ({ children }: NavigationProps) => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userName, setUserName] = useState('');
  const { isMobileSideNavExpanded, setIsMobileSideNavExpanded } = useContext(
    NavContext
  );
  const dropdownNode = useRef<any>();
  const mobileSideNav = useRef<any>();
  const navbarRef = useRef<HTMLDivElement | null>(null); // Ref used for setting setNavbarHeight

  useEffect(() => {
    let isMounted = true;
    if (authState?.isAuthenticated) {
      oktaAuth.getUser().then((info: any) => {
        if (isMounted) {
          setUserName(info.name);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [authState, oktaAuth]);

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (
        dropdownNode &&
        dropdownNode.current &&
        dropdownNode.current.contains(e.target)
      ) {
        return;
      }

      if (
        mobileSideNav &&
        mobileSideNav.current &&
        mobileSideNav.current.contains(e.target)
      ) {
        return;
      }

      setIsMobileSideNavExpanded(false);
    };

    document.addEventListener('mouseup', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, [setIsMobileSideNavExpanded]);

  useEffect(() => {
    const handleResize = () => {
      if (isMobileSideNavExpanded && window.innerWidth > 1023) {
        setIsMobileSideNavExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signout = () => {
    localStorage.removeItem(localAuthStorageKey);
    oktaAuth.signOut();
  };

  return (
    <div className="navigation" role="banner" ref={navbarRef}>
      {authState?.isAuthenticated && (
        <Grid className="sticky sticky-nav-header navigation__content flex-wrap">
          <NavigationBar
            toggle={setIsMobileSideNavExpanded}
            signout={signout}
            userName={userName}
          />
          <ServiceAlert />
        </Grid>
      )}

      <div>{children}</div>
    </div>
  );
};

export default Navigation;
