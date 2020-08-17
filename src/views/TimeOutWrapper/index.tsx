import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import { DateTime } from 'luxon';

import { AppState } from 'reducers/rootReducer';

type TimeOutWrapperProps = {
  children: React.ReactNode;
};

const sessionTimeout = { minutes: 14 };

const TimeOutWrapper = ({ children }: TimeOutWrapperProps) => {
  const lastActiveAt = useSelector(
    (state: AppState) => state.auth.lastActiveAt
  );
  const { authState, authService } = useOktaAuth();

  const registerExpire = async () => {
    const tokenManager = await authService.getTokenManager();
    // clear the old listener so we don't register millions of them
    tokenManager.off('expired');
    tokenManager.on('expired', (key: any) => {
      const activeSessionWindow = DateTime.local()
        .minus(sessionTimeout)
        .toMillis();
      if (lastActiveAt > activeSessionWindow) {
        tokenManager.renew(key);
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
  }, [authState.isAuthenticated, lastActiveAt]);

  return <>{children}</>;
};

export default TimeOutWrapper;
