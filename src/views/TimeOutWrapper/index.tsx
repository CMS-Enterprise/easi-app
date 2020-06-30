import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import { DateTime } from 'luxon';
import { updateLastActiveAt } from 'reducers/authReducer';
import { AppState } from 'reducers/rootReducer';

type TimeOutWrapperProps = {
  children: React.ReactNode;
};

const sessionTimeout = { minutes: 14 };

const registerExpire = async (
  authService: any,
  lastActiveAt: number | null
) => {
  const tokenManager = await authService.getTokenManager();

  // clear the old listener so we don't register millions of them
  tokenManager.off('expired');
  tokenManager.on('expired', (key: any) => {
    console.log('Token Expired Fired');
    const activeSessionWindow = DateTime.local()
      .minus(sessionTimeout)
      .toMillis();
    if (
      lastActiveAt &&
      lastActiveAt > activeSessionWindow &&
      ['idToken', 'accessToken'].includes(key)
    ) {
      console.log('Trying to renew token');
      tokenManager.renew(key);
    }
  });
};

/**
 * As of okta-react 3.0.1, autoRenew on the Security component does
 * not work. We need to manually renew the session and access token.
 */
const TimeOutWrapper = ({ children }: TimeOutWrapperProps) => {
  const dispatch = useDispatch();
  const { authState, authService } = useOktaAuth();
  const lastActiveAt = useSelector(
    (state: AppState) => state.auth.lastActiveAt
  );

  // Getting the session renews it
  const renewSession = async () => {
    // eslint-disable-next-line no-underscore-dangle
    await authService._oktaAuth.session.get();
    dispatch(updateLastActiveAt);
  };

  useEffect(() => {
    const currentTime = Date.now();
    const renewThreshold = 30 * 1000;
    if (lastActiveAt && currentTime > lastActiveAt + renewThreshold) {
      console.log('Renew Session');
      renewSession();
    }
  });

  useEffect(() => {
    console.log('Storing session');
    if (authState.isAuthenticated) renewSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated]);

  if (authState.isAuthenticated) {
    registerExpire(authService, lastActiveAt);
  }

  return <>{children}</>;
};

export default TimeOutWrapper;
