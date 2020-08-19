import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';

import { updateLastRenewAt } from 'reducers/authReducer';
import { AppState } from 'reducers/rootReducer';

type TimeOutWrapperProps = {
  children: React.ReactNode;
};

const TimeOutWrapper = ({ children }: TimeOutWrapperProps) => {
  const lastActiveAt = useSelector(
    (state: AppState) => state.auth.lastActiveAt
  );
  const lastRenewAt = useSelector((state: AppState) => state.auth.lastRenewAt);
  const activeSinceLastRenew = lastActiveAt > lastRenewAt;

  const dispatch = useDispatch();
  const { authState, authService } = useOktaAuth();

  const registerExpire = async () => {
    const tokenManager = await authService.getTokenManager();
    // clear the old listener so we don't register millions of them
    tokenManager.off('expired');
    tokenManager.on('expired', (key: any) => {
      if (activeSinceLastRenew) {
        tokenManager.renew(key);
        dispatch(updateLastRenewAt);
      } else {
        authService.logout('/login');
      }
    });
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      registerExpire();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated, activeSinceLastRenew]);

  return <>{children}</>;
};

export default TimeOutWrapper;
