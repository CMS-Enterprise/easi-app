import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdleTimer } from 'react-idle-timer';
import { useOktaAuth } from '@okta/okta-react';
import { Button } from '@trussworks/react-uswds';
import { DateTime, Duration } from 'luxon';

import Modal from 'components/Modal';
import useInterval from 'hooks/useInterval';

type TimeOutWrapperProps = {
  children: React.ReactNode;
};

const TimeOutWrapper = ({ children }: TimeOutWrapperProps) => {
  const [lastActiveAt, setLastActiveAt] = useState(DateTime.local().toMillis());
  const [countdown, setCountdown] = useState(
    Duration.fromObject({ minutes: 5 }).as('seconds')
  );

  useIdleTimer({
    onAction: () => {
      setLastActiveAt(DateTime.local().toMillis());
    },
    events: ['mousedown', 'keydown'],
    debounce: 500
  });

  const { authState, oktaAuth } = useOktaAuth();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRemainingArr, setTimeRemainingArr] = useState([0, 'second']);

  const tenMinutes = Duration.fromObject({ minutes: 10 }).as('milliseconds');

  const forceRenew = async () => {
    const tokenManager = await oktaAuth.tokenManager;
    tokenManager.renew('idToken');
    tokenManager.renew('accessToken');
  };

  /**
   * @param timeRemaining seconds
   * @returns [minutes, seconds]
   */
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
    setLastActiveAt(DateTime.local().toMillis());
    setCountdown(Duration.fromObject({ minutes: 5 }).as('seconds'));
    forceRenew();
  };

  // useInterval starts once the modal is open and stops when it's closed
  // Updates the minutes/seconds in the message
  useInterval(
    () => {
      setCountdown(countdown - 1);

      if (countdown <= 0) {
        oktaAuth.signOut({
          postLogoutRedirectUri: `${window.location.origin}/login`
        });
      }
      setTimeRemainingArr(formatSessionTimeRemaining(countdown));
    },
    authState?.isAuthenticated && isModalOpen ? 1000 : null
  );

  // useInterval starts when a user is logged in AND the modal is not open
  // useInterval stops/pauses, when a use is logged out or the modal is open
  // Calculates the user's inactivity to display the modal
  useInterval(
    () => {
      if (lastActiveAt + tenMinutes < DateTime.local().toMillis()) {
        setTimeRemainingArr(formatSessionTimeRemaining(countdown));
        setIsModalOpen(true);
      }
    },
    authState?.isAuthenticated && !isModalOpen ? 1000 : null
  );

  // If user is authenticated and has a token, renew it forever five
  // minutes before expiration.
  // The user's inactivity will log the user out.
  useEffect(() => {
    const twoMinutes = Duration.fromObject({ minutes: 2 }).as('seconds');

    if (authState?.isAuthenticated && authState.accessToken) {
      // expiresAt is in seconds
      const timeUntilTokenExpiration =
        authState?.accessToken?.expiresAt -
        DateTime.local().toSeconds() -
        twoMinutes;

      const timeout = setTimeout(() => {
        forceRenew();
      }, timeUntilTokenExpiration * 1000);

      return () => clearTimeout(timeout);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated, authState?.accessToken]);

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
