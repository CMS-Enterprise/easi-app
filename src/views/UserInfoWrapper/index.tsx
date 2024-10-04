import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';
import useOktaSession from 'hooks/useOktaSession';
import { setUser } from 'reducers/authReducer';
import { isLocalAuthEnabled } from 'utils/auth';

type UserInfoWrapperProps = {
  children: React.ReactNode;
};

type oktaUserProps = {
  name?: string;
  euaId?: string;
  groups?: string[];
};

const UserInfoWrapper = ({ children }: UserInfoWrapperProps) => {
  const dispatch = useDispatch();
  const { authState, oktaAuth } = useOktaAuth();

  const { hasSession } = useOktaSession();

  const storeUserInfo = async () => {
    if (
      isLocalAuthEnabled() &&
      window.localStorage[localAuthStorageKey] &&
      JSON.parse(window.localStorage[localAuthStorageKey]).favorLocalAuth
    ) {
      const oktaUser: oktaUserProps = await oktaAuth.getUser();
      const user = {
        name: oktaUser.name,
        euaId: oktaUser.euaId || '',
        groups: oktaUser.groups || []
      };
      dispatch(setUser(user));
    } else {
      const user = {
        name: authState?.idToken?.claims.name,
        euaId: authState?.idToken?.claims.preferred_username,
        // @ts-ignore
        groups: authState?.accessToken?.claims.groups || []
      };
      dispatch(setUser(user));
    }
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      storeUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated]);

  // Return null until we know if the user is authenticated.  This prevents unwanted UX flicker. Does not trigger condition for local auth/non okta development
  if (
    !window.localStorage[localAuthStorageKey] &&
    oktaAuth.authStateManager.getAuthState() === null &&
    !hasSession
  ) {
    return null;
  }

  return <>{children}</>;
};

export default UserInfoWrapper;
