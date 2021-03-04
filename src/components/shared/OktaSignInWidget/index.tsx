// src/OktaSignInWidget.js

import React, { useEffect, useRef } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';

type OktaSignInWidgetProps = {
  onSuccess: (auth: any) => any;
  onError: () => void;
};

const OktaSignInWidget = ({ onSuccess, onError }: OktaSignInWidgetProps) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    let signIn: any;
    if (widgetRef.current) {
      signIn = new OktaSignIn({
        el: widgetRef.current,
        baseUrl: process.env.REACT_APP_OKTA_DOMAIN,
        clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
        authParams: {
          pkce: true,
          issuer: process.env.REACT_APP_OKTA_ISSUER,
          responseMode: 'query'
        }
      });

      signIn
        .showSignInToGetTokens({
          authorizationServerId: process.env.REACT_APP_OKTA_SERVER_ID,
          clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
          redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI,
          scopes: ['openid', 'profile', 'email']
        })
        .then(onSuccess)
        .catch(onError);
    }

    return () => signIn.remove();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={widgetRef} />;
};

export default OktaSignInWidget;
