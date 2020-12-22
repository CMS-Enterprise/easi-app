import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';

import { setUser } from 'reducers/authReducer';
import { isLocalEnvironment } from 'utils/local';

type UserInfoWrapperProps = {
  children: React.ReactNode;
};

const UserInfoWrapper = ({ children }: UserInfoWrapperProps) => {
  const dispatch = useDispatch();
  const { authState, authService } = useOktaAuth();

  const storeUserInfo = async () => {
    if (isLocalEnvironment()) {
      const user = {
        name: authState.name,
        euaId: authState.euaId || '',
        groups: authState.groups || []
      };
      dispatch(setUser(user));
    } else {
      const tokenManager = await authService.getTokenManager();
      const accessToken = await tokenManager.get('accessToken');
      const idToken = await tokenManager.get('idToken');
      if (accessToken && idToken) {
        const accessTokenValue = accessToken.value;
        const decodedBearerToken = JSON.parse(
          atob(accessTokenValue.split('.')[1])
        );

        const idTokenValue = idToken.value;
        const decodedIdToken = JSON.parse(atob(idTokenValue.split('.')[1]));
        const user = {
          name: (decodedIdToken && decodedIdToken.name) || '',
          euaId: (decodedIdToken && decodedIdToken.preferred_username) || '',
          groups: (decodedBearerToken && decodedBearerToken.groups) || []
        };
        dispatch(setUser(user));
      }
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      storeUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated]);

  return <>{children}</>;
};

export default UserInfoWrapper;
