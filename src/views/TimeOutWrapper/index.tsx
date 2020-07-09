import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import { DateTime, Duration } from 'luxon';
import Modal from 'components/Modal';
import Button from 'components/shared/Button';
import { updateLastSessionRenew } from 'reducers/authReducer';
import { AppState } from 'reducers/rootReducer';

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
    if (
      lastActiveAt > activeSessionWindow &&
      ['idToken', 'accessToken'].includes(key)
    ) {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRemainingString, setTimeRemainingString] = useState('');
  const lastActiveAt = useSelector(
    (state: AppState) => state.auth.lastActiveAt
  );

  const sessionExpiration = useSelector(
    (state: AppState) => state.auth.sessionExpiration
  );

  const oneSecond = Duration.fromObject({ seconds: 1 }).as('milliseconds');
  const oneMinute = Duration.fromObject({ minutes: 1 }).as('milliseconds');
  const fiveMinutes = Duration.fromObject({ minutes: 5 }).as('milliseconds');

  const storeSession = async () => {
    // eslint-disable-next-line no-underscore-dangle
    const session = await authService._oktaAuth.session.get();
    const expiresAt = new Date(session.expiresAt).getTime();
    dispatch(updateLastSessionRenew(expiresAt));
  };

  const formatSessionTimeRemaining = () => {
    if (sessionExpiration) {
      const currentTime = Date.now();
      const timeRemaining = sessionExpiration - currentTime;

      // If over a minute remaining, displays X minutes
      if (timeRemaining > oneMinute + oneSecond) {
        // We need to add a minute to make sure the correct number of minutes displays
        // e.g. 4 minutes 59 seconds shows 4 minutes; add a minute to display 5 minutes
        return Duration.fromMillis(timeRemaining + oneMinute).toFormat(
          "m 'minutes'"
        );
      }

      if (timeRemaining > oneMinute) {
        return '1 minute';
      }

      // If less than a minute remaining, display X second(s)
      return Duration.fromMillis(timeRemaining).toFormat(
        `${timeRemaining >= oneSecond * 10 ? 'ss' : 's'} 'second${
          timeRemaining >= oneSecond * 2 || timeRemaining < oneSecond ? 's' : ''
        }' `
      );
    }
    return '';
  };

  const handleModalExit = async () => {
    await storeSession();
    await setIsModalOpen(false);
  };

  useEffect(() => {
    let sessionInterval: ReturnType<typeof setInterval>;
    if (sessionExpiration) {
      sessionInterval = setInterval(() => {
        const currentTime = Date.now();

        // If the session expires in 5 minutes or less
        if (currentTime + fiveMinutes > sessionExpiration) {
          setTimeRemainingString(formatSessionTimeRemaining());
          if (!isModalOpen) {
            setIsModalOpen(true);
          }
        }

        // If the session expired
        if (currentTime + oneSecond >= sessionExpiration) {
          clearInterval(sessionInterval);
          setIsModalOpen(false);
          authService.logout('/login');
        }
      }, 1000);
    }

    return () => clearInterval(sessionInterval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionExpiration]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      registerExpire(authService, lastActiveAt);
      storeSession();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated]);

  return (
    <>
      <Modal
        title="EASi"
        isOpen={isModalOpen}
        closeModal={handleModalExit}
        shouldCloseOnOverlayClick={false}
      >
        <h3
          className="margin-top-0"
          role="timer"
          aria-live={timeRemainingString.includes('minute') ? 'polite' : 'off'}
          aria-atomic="true"
        >
          Your access to EASi will expire in {timeRemainingString}
        </h3>
        <p>Your data has been saved.</p>
        <p>
          If you do not do anything on this page, you will be signed out in{' '}
          {timeRemainingString} and will need to sign back in. We do this to
          keep your information secure.
        </p>
        <Button type="button" onClick={handleModalExit}>
          Return to EASi
        </Button>
      </Modal>
      {children}
    </>
  );
};

export default TimeOutWrapper;
