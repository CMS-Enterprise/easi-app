import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import { DateTime, Duration } from 'luxon';
import { useTranslation } from 'react-i18next';
import Modal from 'components/Modal';
import Button from 'components/shared/Button';
import { updateLastActiveAt } from 'reducers/authReducer';
import { AppState } from 'reducers/rootReducer';
import useInterval from 'hooks/useInterval';

type TimeOutWrapperProps = {
  children: React.ReactNode;
};

/**
 * As of okta-react 3.0.1, autoRenew on the Security component does
 * not work. We need to manually renew the session and access token.
 */
const TimeOutWrapper = ({ children }: TimeOutWrapperProps) => {
  const dispatch = useDispatch();
  const { authState, authService } = useOktaAuth();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRemainingArr, setTimeRemainingArr] = useState([0, 'second']);
  const lastActiveAt = useSelector(
    (state: AppState) => state.auth.lastActiveAt
  );

  const oneSecond = Duration.fromObject({ seconds: 1 }).as('milliseconds');
  const fiveMinutes = Duration.fromObject({ minutes: 5 }).as('milliseconds');

  const registerExpire = async () => {
    const tokenManager = await authService.getTokenManager();
    // clear the old listener so we don't register millions of them
    tokenManager.off('expired');
    tokenManager.on('expired', (key: any) => {
      const activeSessionWindow = DateTime.local()
        .minus({ minutes: 14 })
        .toMillis();
      console.log('---');
      console.log('lastActiveAt', lastActiveAt);
      console.log('activeSessionWindow', activeSessionWindow);
      if (lastActiveAt > activeSessionWindow) {
        console.log('renewing', key);
        tokenManager.renew(key);
      } else {
        console.log('registerExpire: logging out');
        authService.logout('/login');
      }
      console.log('---');
    });
  };

  const formatSessionTimeRemaining = (
    timeRemaining: number
  ): [number, string] => {
    const seconds = Math.floor(
      Duration.fromMillis(timeRemaining).as('seconds')
    );

    const minutes = seconds / 60;
    // Using Math.ceil() for greater than one minute
    // 299 seconds = 4.983 minutes, but should still display 5 minutes
    // Using Math.floor() for less than one minute
    // 59 seconds = .983 minutes, Using floor so minutes is 0 to display 59 secounds
    const wholeMinutes = minutes > 1 ? Math.ceil(minutes) : Math.floor(minutes);

    return wholeMinutes > 0
      ? [wholeMinutes, 'minute']
      : [Math.floor(seconds), 'second'];
  };

  const handleModalExit = async () => {
    setIsModalOpen(false);
    const tokenManager = await authService.getTokenManager();
    await tokenManager.renew('accessToken');
    await tokenManager.renew('idToken');
    dispatch(updateLastActiveAt);
  };

  // useInterval starts once the modal is open and stops when it's closed
  // Updates the minutes/seconds in the message
  useInterval(
    async () => {
      const currentTime = Date.now();
      const tokenManager = await authService.getTokenManager();
      const accessToken = await tokenManager.get('accessToken');
      if (accessToken) {
        const tokenExp = DateTime.fromSeconds(accessToken.expiresAt).toMillis();

        if (tokenExp - currentTime >= 0) {
          setTimeRemainingArr(
            formatSessionTimeRemaining(tokenExp - currentTime)
          );
        }
      }
    },
    isModalOpen ? oneSecond : null
  );

  // useInterval starts when a user is logged in AND the modal is not open
  // useInterval stops/pauses, when a use is logged out or the modal is open
  // Calculates the user's inactivity to display the modal
  useInterval(
    async () => {
      const currentTime = Date.now();
      const tokenManager = await authService.getTokenManager();
      const accessToken = await tokenManager.get('accessToken');
      const tokenExp = DateTime.fromSeconds(accessToken.expiresAt).toMillis();

      if (tokenExp - currentTime < fiveMinutes) {
        setTimeRemainingArr(formatSessionTimeRemaining(tokenExp - currentTime));
        setIsModalOpen(true);
      }
    },
    authState.isAuthenticated && !isModalOpen ? oneSecond : null
  );

  useEffect(() => {
    if (authState.isAuthenticated) {
      registerExpire();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated]);

  return (
    <>
      <Modal title="EASi" isOpen={isModalOpen} closeModal={handleModalExit}>
        <h3
          className="margin-top-0"
          role="timer"
          aria-live={timeRemainingArr[1] === 'minute' ? 'polite' : 'off'}
          aria-atomic="true"
        >
          {t('auth:modal.title', {
            count: Number(timeRemainingArr[0]),
            context: String(timeRemainingArr[1])
          })}
        </h3>
        <p>{t('auth:modal.dataSaved')}</p>
        <p>
          {t('auth:modal.inactivityWarning', {
            count: Number(timeRemainingArr[0]),
            context: String(timeRemainingArr[1])
          })}
        </p>
        <Button type="button" onClick={handleModalExit}>
          {t('auth:modal.cta')}
        </Button>
      </Modal>
      {children}
    </>
  );
};

export default TimeOutWrapper;
