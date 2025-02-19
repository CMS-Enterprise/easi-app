import React, { useEffect, useRef, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Grid } from '@trussworks/react-uswds';

import NavigationBar from 'components/NavigationBar';
import { localAuthStorageKey } from 'constants/localAuth';

import '../../../components/Header/index.scss';
import './index.scss';

type NavigationProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const Navigation = ({ children }: NavigationProps) => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userName, setUserName] = useState('');
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

  const signout = () => {
    localStorage.removeItem(localAuthStorageKey);
    oktaAuth.signOut();
  };

  return (
    <div className="navigation" role="banner" ref={navbarRef}>
      {authState?.isAuthenticated && (
        <Grid className="sticky sticky-nav-header navigation__content">
          <NavigationBar signout={signout} userName={userName} />
        </Grid>
      )}

      <div>{children}</div>
    </div>
  );
};

export default Navigation;
