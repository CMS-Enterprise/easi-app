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
    const groups = (accessToken && accessToken.groups) || ['sara-test-token'];
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
