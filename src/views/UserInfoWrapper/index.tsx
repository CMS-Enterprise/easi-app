import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';

import { setUserGroups } from 'reducers/authReducer';

type UserInfoWrapper = {
  children: React.ReactNode;
};

const UserInfoWrapper = ({ children }: UserInfoWrapper) => {
  const dispatch = useDispatch();
  const { authState, authService } = useOktaAuth();

  const storeUserInfo = async () => {
    const tokenManager = await authService.getTokenManager();
    const accessToken = await tokenManager.get('accessToken');
    const token = accessToken.value;
    const decodedBearerToken = JSON.parse(atob(token.split('.')[1]));
    const groups = (decodedBearerToken && decodedBearerToken.groups) || [];
    dispatch(setUserGroups(groups));
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
