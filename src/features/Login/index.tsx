import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import DevLogin from 'wrappers/AuthenticationWrapper/DevLogin';

import MainContent from 'components/MainContent';
import OktaSignInWidget from 'components/OktaSignInWidget';
import PageHeading from 'components/PageHeading';
import Spinner from 'components/Spinner';
import { localAuthStorageKey } from 'constants/localAuth';
import { isLocalAuthEnabled, isOktaRedirectLoginEnabled } from 'utils/auth';

const Login = () => {
  let defaultAuth = false;
  const { oktaAuth, authState } = useOktaAuth();
  const history = useHistory();
  const location = useLocation();
  const redirectInitiated = useRef(false);

  const queryParams = new URLSearchParams(location.search);
  const localAuthRequested = queryParams.get('local') === 'true';

  if (isLocalAuthEnabled() && window.localStorage[localAuthStorageKey]) {
    defaultAuth = JSON.parse(
      window.localStorage[localAuthStorageKey]
    ).favorLocalAuth;
  }
  const [isLocalAuth, setIsLocalAuth] = useState(
    defaultAuth || (isLocalAuthEnabled() && localAuthRequested)
  );

  const handleUseLocalAuth = () => {
    setIsLocalAuth(true);
  };

  const onSuccess = (tokens: any) => {
    const referringUri = oktaAuth.getOriginalUri();
    oktaAuth.handleLoginRedirect(tokens).then(() => {
      history.push(referringUri || '/');
    });
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      history.replace('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated]);

  useEffect(() => {
    if (
      isOktaRedirectLoginEnabled() &&
      !isLocalAuth &&
      authState &&
      !authState.isAuthenticated &&
      !redirectInitiated.current
    ) {
      redirectInitiated.current = true;
      oktaAuth.signInWithRedirect();
    }
  }, [authState, isLocalAuth, oktaAuth]);

  if (isLocalAuthEnabled() && isLocalAuth) {
    return (
      <MainContent className="grid-container margin-top-4">
        <DevLogin />
      </MainContent>
    );
  }

  if (isOktaRedirectLoginEnabled()) {
    return (
      <MainContent className="grid-container margin-top-4">
        <div className="display-flex flex-justify-center">
          <Spinner size="large" data-testid="okta-redirect-login" />
        </div>
      </MainContent>
    );
  }

  // TODO (EASI-XXXX): remove widget branch after Okta redirect login is permanent
  return (
    <MainContent className="grid-container">
      {isLocalAuthEnabled() && (
        <div>
          <button
            type="button"
            onClick={handleUseLocalAuth}
            data-testid="LocalAuth-Visit"
          >
            Use Local Auth
          </button>
        </div>
      )}
      <PageHeading>Sign in using EUA</PageHeading>
      <OktaSignInWidget onSuccess={onSuccess} onError={() => {}} />
    </MainContent>
  );
};

export default Login;
