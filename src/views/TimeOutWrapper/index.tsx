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

  const storeSession = async () => {
    // eslint-disable-next-line no-underscore-dangle
    const session = await authService._oktaAuth.session.get();
    const expiresAt = new Date(session.expiresAt).getTime();
    dispatch(updateLastSessionRenew(expiresAt));
  };

  const calculateSessionTimeRemaining = () => {
    if (sessionExpiration) {
      const currentTime = Date.now();
      const timeRemaining = sessionExpiration - currentTime;
      const oneSecond = Duration.fromObject({ seconds: 1 }).as('milliseconds');
      const oneMinute = Duration.fromObject({ minutes: 1 }).as('milliseconds');

      if (timeRemaining >= oneMinute) {
        return Duration.fromMillis(timeRemaining).toFormat(
          `m 'minute${timeRemaining > oneMinute * 2 ? 's' : ''}'`
        );
      }
      return Duration.fromMillis(timeRemaining).toFormat(
        `${timeRemaining >= oneSecond * 10 ? 'ss' : 's'} 'second${
          timeRemaining >= oneSecond * 2 || timeRemaining < oneSecond ? 's' : ''
        }' `
      );
    }
    return '';
  };

  // useEffect(() => {
  //   const currentTime = Date.now();
  //   const renewThreshold = 30 * 1000;
  //   // Don't renew session if modal is open
  //   if (!isModalOpen) {
  //     if (lastSessionRenew && currentTime > lastSessionRenew + renewThreshold) {
  //       storeSession();
  //     }
  //   }
  // });

  useEffect(() => {
    const oneSecond = Duration.fromObject({ seconds: 1 }).as('milliseconds');
    // has extra 59 seconds so that 5 doesn't immediately turn into 4
    const fiveMinutes = Duration.fromObject({ minutes: 5, seconds: 59 }).as(
      'milliseconds'
    );
    let sessionInterval: ReturnType<typeof setInterval>;
    if (sessionExpiration) {
      sessionInterval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime + fiveMinutes > sessionExpiration) {
          setTimeRemainingString(calculateSessionTimeRemaining());
          if (!isModalOpen) {
            setIsModalOpen(true);
          }
        }

        if (currentTime + oneSecond >= sessionExpiration) {
          clearInterval(sessionInterval);
          authService.logout('/');
        }
      }, 1000);
    }

    return () => clearInterval(sessionInterval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionExpiration]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      storeSession();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated]);

  if (authState.isAuthenticated) {
    registerExpire(authService, lastActiveAt);
  }

  return (
    <>
      <Modal
        title="EASi"
        isOpen={isModalOpen}
        closeModal={() => {
          storeSession();
          setIsModalOpen(false);
        }}
      >
        <h3 className="margin-top-0">
          Your access to EASi will expire in {timeRemainingString}
        </h3>
        <p>Your data has been saved.</p>
        <p>
          If you do not do anything on this page, you will be signed out in{' '}
          {timeRemainingString} and will need to sign back in. We do this to
          keep your information secure.
        </p>
        <Button
          type="button"
          onClick={() => {
            storeSession();
            setIsModalOpen(false);
          }}
        >
          Return to EASi
        </Button>
      </Modal>
      {children}
    </>
  );
};

export default TimeOutWrapper;
//
