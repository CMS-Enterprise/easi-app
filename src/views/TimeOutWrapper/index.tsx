import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdleTimer } from 'react-idle-timer';
import { useOktaAuth } from '@okta/okta-react';
import { Button } from '@trussworks/react-uswds';
import { DateTime, Duration } from 'luxon';

import Modal from 'components/Modal';
import { localAuthStorageKey } from 'constants/localAuth';
import useInterval from 'hooks/useInterval';

const accessTokenExpires = () => {
  const token = localStorage.getItem('okta-token-storage') || '';
  if (token === '') {
    return Number.MAX_SAFE_INTEGER;
  }
  const { accessToken } = JSON.parse(token);
  return accessToken && accessToken.expiresAt;
};

const calculcateTokenExpiration = () => {
  const currentTime = Math.floor(Date.now() / 1000);
  return accessTokenExpires() - currentTime;
};

type TimeOutWrapperProps = {
  children: React.ReactNode;
};

const TimeOutWrapper = ({ children }: TimeOutWrapperProps) => {
  const [lastActiveAt, setLastActiveAt] = useState(DateTime.local());
  const [lastRenewAt, setLastRenewAt] = useState(DateTime.local());
  const activeSinceLastRenew = lastActiveAt > lastRenewAt;

  useIdleTimer({
    onAction: () => setLastActiveAt(DateTime.local()),
    debounce: 500
  });

  const { authState, oktaAuth } = useOktaAuth();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRemainingArr, setTimeRemainingArr] = useState([0, 'second']);

  const oneSecond = Duration.fromObject({ seconds: 1 }).as('milliseconds');
  const fiveMinutes = Duration.fromObject({ minutes: 5 }).as('seconds');

  const forceRenew = async () => {
    const tokenManager = await oktaAuth.tokenManager;
    tokenManager.renew('idToken');
    tokenManager.renew('accessToken');
    setLastActiveAt(DateTime.local());
    setLastRenewAt(DateTime.local());
  };

  const registerExpire = async () => {
    const tokenManager = await oktaAuth.tokenManager;

    // clear the old listener so we don't register millions of them
    tokenManager.off('expired');
    tokenManager.on('expired', (key: any) => {
      if (activeSinceLastRenew) {
        tokenManager.renew(key);
        setLastRenewAt(DateTime.local());
      } else {
        localStorage.removeItem(localAuthStorageKey);
        oktaAuth.signOut({
          postLogoutRedirectUri: `${window.location.origin}/login`
        });
      }
    });
  };

  const formatSessionTimeRemaining = (
    timeRemaining: number
  ): [number, string] => {
    const minutes = timeRemaining / 60;
    // Using Math.ceil() for greater than one minute
    // 299 seconds = 4.983 minutes, but should still display 5 minutes
    // Using Math.floor() for less than one minute
    // 59 seconds = .983 minutes, Using floor so minutes is 0 to display 59 secounds
    const wholeMinutes = minutes > 1 ? Math.ceil(minutes) : Math.floor(minutes);

    if (timeRemaining > 0) {
      if (wholeMinutes > 0) {
        return [wholeMinutes, 'minute'];
      }
      return [Math.floor(timeRemaining), 'second'];
    }
    return [0, 'second'];
  };

  const handleModalExit = async () => {
    setIsModalOpen(false);
    forceRenew();
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      registerExpire();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated, activeSinceLastRenew]);

  // useInterval starts once the modal is open and stops when it's closed
  // Updates the minutes/seconds in the message
  useInterval(
    () => {
      const tokenExpiresIn = calculcateTokenExpiration();
      setTimeRemainingArr(formatSessionTimeRemaining(tokenExpiresIn));
    },
    authState?.isAuthenticated && isModalOpen ? oneSecond : null
  );

  // useInterval starts when a user is logged in AND the modal is not open
  // useInterval stops/pauses, when a use is logged out or the modal is open
  // Calculates the user's inactivity to display the modal
  useInterval(
    () => {
      const tokenExpiresIn = calculcateTokenExpiration();
      if (
        !activeSinceLastRenew &&
        tokenExpiresIn > 0 &&
        tokenExpiresIn < fiveMinutes
      ) {
        setTimeRemainingArr(formatSessionTimeRemaining(tokenExpiresIn));
        setIsModalOpen(true);
      }
    },
    authState?.isAuthenticated && !isModalOpen ? oneSecond : null
  );

  return (
    <>
      <Modal isOpen={isModalOpen} closeModal={handleModalExit}>
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
