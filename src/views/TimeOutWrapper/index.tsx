import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import { Button } from '@trussworks/react-uswds';
import { Duration } from 'luxon';

import Modal from 'components/Modal';
import useInterval from 'hooks/useInterval';
import { updateLastActiveAt, updateLastRenewAt } from 'reducers/authReducer';
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
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRemainingArr, setTimeRemainingArr] = useState([0, 'second']);

  const oneSecond = Duration.fromObject({ seconds: 1 }).as('milliseconds');
  const fiveMinutes = Duration.fromObject({ minutes: 5 }).as('milliseconds');

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
    dispatch(updateLastActiveAt);
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      registerExpire();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated, activeSinceLastRenew]);

  // useInterval starts once the modal is open and stops when it's closed
  // Updates the minutes/seconds in the message
  // useInterval(
  //   async () => {
  //     const currentTime = Date.now();
  //     const tokenManager = await authService.getTokenManager();
  //     const accessToken = await tokenManager.get('accessToken');
  //     // convert from seconds to miliseconds
  //     const accessTokenExpires = accessToken.expiresAt * oneSecond;
  //     if (accessTokenExpires - currentTime >= 0) {
  //       setTimeRemainingArr(
  //         formatSessionTimeRemaining(accessTokenExpires - currentTime)
  //       );
  //     }
  //   },
  //   isModalOpen ? oneSecond : null
  // );

  // useInterval starts when a user is logged in AND the modal is not open
  // useInterval stops/pauses, when a use is logged out or the modal is open
  // Calculates the user's inactivity to display the modal
  useInterval(
    async () => {
      const currentTime = Date.now();
      const tokenManager = await authService.getTokenManager();
      const accessToken = await tokenManager.get('accessToken');
      // convert from seconds to miliseconds
      const accessTokenExpires =
        accessToken && accessToken.expiresAt * oneSecond;
      // const accessTokenExpires =
      //   Date.now() - Duration.fromObject({ minutes: 5 }).as('milliseconds');
      if (
        !activeSinceLastRenew &&
        accessTokenExpires - currentTime < fiveMinutes
      ) {
        setTimeRemainingArr(
          formatSessionTimeRemaining(accessTokenExpires - currentTime)
        );
        setIsModalOpen(true);
      }
    },
    authState.isAuthenticated && !isModalOpen ? oneSecond : null
  );

  // useInterval(
  //   () => {
  //     const currentTime = Date.now();
  //     const accessTokenExpires =
  //       Date.now() + Duration.fromObject({ minutes: 4 }).as('milliseconds');
  //     if (
  //       !activeSinceLastRenew &&
  //       accessTokenExpires - currentTime < fiveMinutes
  //     ) {
  //       setTimeRemainingArr(
  //         formatSessionTimeRemaining(accessTokenExpires - currentTime)
  //       );
  //       setIsModalOpen(true);
  //     }
  //   },
  //   authState.isAuthenticated && !isModalOpen ? oneSecond : null
  // );

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
