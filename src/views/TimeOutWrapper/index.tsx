import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'reducers/rootReducer';
import { useOktaAuth } from '@okta/okta-react';
import { DateTime } from 'luxon';

type TimeOutWrapperProps = {
  children: React.ReactNode;
};

const sessionTimeout = { minutes: 14 };

const registerExpire = async (authService: any, lastActiveAt: number) => {
  const tokenManager = await authService.getTokenManager();
  // clear the old listener so we don't register millions of them
  tokenManager.off('expired');
  tokenManager.on('expired', (key: any) => {
    const activeSessionWindow = DateTime.local()
      .minus(sessionTimeout)
      .toMillis();
    if (lastActiveAt > activeSessionWindow) {
      tokenManager.renew(key);
    }
  });
};

const TimeOutWrapper = ({ children }: TimeOutWrapperProps) => {
  const lastActiveAt = useSelector(
    (state: AppState) => state.auth.lastActiveAt
  );

  const { authService }: { authService: any } = useOktaAuth();
  registerExpire(authService, lastActiveAt);

  return <>{children}</>;
};

export default TimeOutWrapper;
