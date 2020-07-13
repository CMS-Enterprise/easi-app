import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import { DateTime, Duration } from 'luxon';
import { useTranslation } from 'react-i18next';
import Modal from 'components/Modal';
import Button from 'components/shared/Button';
import { updateLastSessionRenew } from 'reducers/authReducer';
import { AppState } from 'reducers/rootReducer';
import useInterval from 'hooks/useInterval';

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
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sessionInterval = useRef<any>();
  const [timeRemainingArr, setTimeRemainingArr] = useState([0, 'second']);
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

  const formatSessionTimeRemaining = (): [number, string] => {
    if (sessionExpiration) {
      const currentTime = Date.now();
      const timeRemaining = sessionExpiration - currentTime;

      // If over a minute remaining, displays X minutes
      if (timeRemaining > oneMinute + oneSecond) {
        // We need to add a minute to make sure the correct number of minutes displays
        // e.g. 4 minutes 59 seconds shows 4 minutes; add a minute to display 5 minutes
        const minutes = Duration.fromMillis(timeRemaining + oneMinute).as(
          'minutes'
        );
        return [Math.floor(minutes), 'minute'];
      }

      if (timeRemaining >= oneMinute) {
        return [1, 'minute'];
      }

      // If less than a minute remaining, display X second(s)
      const seconds = Duration.fromMillis(timeRemaining).as('seconds');
      return [Math.floor(seconds), 'second'];
    }
    return [0, 'second'];
  };

  const handleModalExit = () => {
    clearTimeout(sessionInterval.current);
    setIsModalOpen(false);
    storeSession();
  };

  useInterval(
    () => {
      const currentTime = Date.now();

      if (currentTime <= sessionExpiration) {
        setTimeRemainingArr(formatSessionTimeRemaining());
      }
    },
    isModalOpen ? 1000 : null
  );

  // If the session expires in 5 minutes or less
  useInterval(
    () => {
      const currentTime = Date.now();
      if (currentTime + fiveMinutes > sessionExpiration) {
        setTimeRemainingArr(formatSessionTimeRemaining());
        setIsModalOpen(true);
      }
    },
    sessionExpiration && !isModalOpen ? 1000 : null
  );

  useInterval(
    () => {
      const currentTime = Date.now();

      // If the session expired
      if (currentTime >= sessionExpiration) {
        clearInterval(sessionInterval.current);
        setIsModalOpen(false);
        authService.logout('/login');
      }
    },
    sessionExpiration && isModalOpen ? 1000 : null
  );

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
