import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';
import { localAuthStorageKey } from 'constants/localAuth';
import { isLocalAuthEnabled } from 'utils/auth';
import DevLogin from 'views/AuthenticationWrapper/DevLogin';

const Login = () => {
  let defaultAuth = false;
  const { oktaAuth, authState } = useOktaAuth();
  const history = useHistory();

  if (isLocalAuthEnabled() && window.localStorage[localAuthStorageKey]) {
    defaultAuth = JSON.parse(window.localStorage[localAuthStorageKey])
      .favorLocalAuth;
  }
  const [isLocalAuth, setIsLocalAuth] = useState(defaultAuth);

  const handleUseLocalAuth = () => {
    setIsLocalAuth(true);
  };

  const onSuccess = (tokens: any) => {
    const referringUri = oktaAuth.getOriginalUri();
    oktaAuth.handleLoginRedirect(tokens).then(() => {
      history.push(referringUri);
    });
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      history.replace('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated]);

  if (isLocalAuthEnabled() && isLocalAuth) {
    return (
      <PageWrapper>
        <MainContent className="grid-container margin-top-4">
          <DevLogin />
        </MainContent>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header />
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
      <Footer />
    </PageWrapper>
  );
};

export default Login;
