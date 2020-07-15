import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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

const sessionTimeout = { minutes: 14 };

const registerExpire = async (authService: any, lastActiveAt: number) => {
  const tokenManager = await authService.getTokenManager();
  // clear the old listener so we don't register millions of them
  tokenManager.off('expired');
  tokenManager.on('expired', (key: any) => {
    console.log("TimeoutWrapper: tokenManager.on('expired')");
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
  const history = useHistory();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRemainingArr, setTimeRemainingArr] = useState([0, 'second']);
  const lastActiveAt = useSelector(
    (state: AppState) => state.auth.lastActiveAt
  );

  const oneSecond = Duration.fromObject({ seconds: 1 }).as('milliseconds');
  const oneMinute = Duration.fromObject({ minutes: 1 }).as('milliseconds');
  const fiveMinutes = Duration.fromObject({ minutes: 5 }).as('milliseconds');
  const modalDisplayIdleTime = Duration.fromObject({ minutes: 10 }).as(
    'milliseconds'
  );
  const idleTimeMax = Duration.fromObject({ minutes: 15 }).as('milliseconds');

  const formatSessionTimeRemaining = (
    timeRemaining: number
  ): [number, string] => {
    // If over a minute remaining, displays X minutes
    if (timeRemaining > oneMinute + oneSecond) {
      // We need to add a minute to make sure the correct number of minutes displays
      // e.g. 4 minutes 59 seconds shows 4 minutes; add a minute to display 5 minutes
      const minutes = Duration.fromMillis(timeRemaining).as('minutes');
      return [Math.ceil(minutes), 'minute'];
    }

    if (timeRemaining >= oneMinute) {
      return [1, 'minute'];
    }

    // If less than a minute remaining, display X second(s)
    const seconds = Duration.fromMillis(timeRemaining).as('seconds');
    return [Math.floor(seconds), 'second'];
  };

  const handleModalExit = () => {
    setIsModalOpen(false);
    authService._oktaAuth.session.refresh();
    dispatch(updateLastActiveAt);
  };

  useInterval(
    async () => {
      const currentTime = Date.now();
      const tokenManager = await authService.getTokenManager();
      const accessToken = await tokenManager.get('accessToken');
      const tokenExp = DateTime.fromSeconds(accessToken.expiresAt).toMillis();

      // if (idleTimeMax - idleTime > 0) {
      setTimeRemainingArr(formatSessionTimeRemaining(tokenExp - currentTime));
      // }
    },
    isModalOpen ? oneSecond : null
  );

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
      registerExpire(authService, lastActiveAt);
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
