import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';

import { setUser } from 'reducers/authReducer';

type UserInfoWrapperProps = {
  children: React.ReactNode;
};

const UserInfoWrapper = ({ children }: UserInfoWrapperProps) => {
  const dispatch = useDispatch();
  const { authState, authService } = useOktaAuth();

  const storeUserInfo = async () => {
    const tokenManager = await authService.getTokenManager();
    const accessToken = await tokenManager.get('accessToken');
    const idToken = await tokenManager.get('idToken');
    const user: {
      name: string;
      euaId: string;
      groups: string[];
    } = {
      name: '',
      euaId: '',
      groups: []
    };
    if (accessToken) {
      const token = accessToken.value;
      const decodedBearerToken = JSON.parse(atob(token.split('.')[1]));
      user.groups = (decodedBearerToken && decodedBearerToken.groups) || [];
    }

    if (idToken) {
      const token = idToken.value;
      const decodedIdToken = JSON.parse(atob(token.split('.')[1]));
      user.name = (decodedIdToken && decodedIdToken.name) || '';
      user.euaId = (decodedIdToken && decodedIdToken.preferred_username) || '';
    }

    dispatch(setUser(user));
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
