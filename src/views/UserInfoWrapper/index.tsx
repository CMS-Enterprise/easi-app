import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';
import { setUser } from 'reducers/authReducer';
import { isLocalAuthEnabled } from 'utils/auth';

type UserInfoWrapperProps = {
  children: React.ReactNode;
};

const UserInfoWrapper = ({ children }: UserInfoWrapperProps) => {
  const dispatch = useDispatch();
  const { authState, oktaAuth } = useOktaAuth();

  const storeUserInfo = async () => {
    if (
      isLocalAuthEnabled() &&
      window.localStorage[localAuthStorageKey] &&
      JSON.parse(window.localStorage[localAuthStorageKey]).favorLocalAuth
    ) {
      const oktaUser = await oktaAuth.getUser();
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

  return <>{children}</>;
};

export default UserInfoWrapper;
