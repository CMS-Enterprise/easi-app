// src/OktaSignInWidget.js
// okta-signin-widget has no typescript support yet.  If becomes available, install and remove disable

import React, { useEffect, useRef } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';

import Spinner from 'components/Spinner';
import useOktaSession from 'hooks/useOktaSession';

import './index.scss';

type OktaSignInWidgetProps = {
  onSuccess: (auth: any) => any;
  onError: () => void;
};

const OktaSignInWidget = ({ onSuccess, onError }: OktaSignInWidgetProps) => {
  const widgetRef = useRef(null);

  const { hasSession, oktaAuth } = useOktaSession();

  useEffect(() => {
    let signIn: any;
    if (widgetRef.current) {
      signIn = new OktaSignIn({
        useClassicEngine: true, // needed since upgrading okta-signin-widget to 7.x: https://github.com/okta/okta-signin-widget/blob/master/MIGRATING.md#migrating-from-6x-to-7x
        el: widgetRef.current,
        baseUrl: import.meta.env.VITE_OKTA_DOMAIN,
        clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
        authParams: {
          pkce: true,
          issuer: import.meta.env.VITE_OKTA_ISSUER,
          responseMode: 'query'
        }
      });

      signIn
        .showSignInToGetTokens({
          authorizationServerId: import.meta.env.VITE_OKTA_SERVER_ID,
          clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
          redirectUri: import.meta.env.VITE_OKTA_REDIRECT_URI,
          scopes: ['openid', 'profile', 'email']
        })
        .then(onSuccess)
        .catch(onError);
    }

    if (hasSession) {
      oktaAuth.signInWithRedirect();
    }

    return () => signIn.remove();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSession, oktaAuth]);

  return (
    <div className="center-container">
      <div className="okta-sign-in-container">
        <div id="easi-okta-sign-in" ref={widgetRef} />
        {hasSession !== false && (
          <div className="nested-overlay">
            <Spinner size="large" />
          </div>
        )}
      </div>
    </div>
  );
};

export default OktaSignInWidget;
