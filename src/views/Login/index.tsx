import React from 'react';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';
import { isLocalEnvironment } from 'utils/local';
import DevLogin from 'views/AuthenticationWrapper/DevLogin';

const storageKey = 'dev-user-config';

const Login = () => {
  const useLocalLogin = () => {
    return (
      isLocalEnvironment() &&
      !(
        window.localStorage[storageKey] &&
        JSON.parse(window.localStorage[storageKey]).favorOktaAuth
      )
    );
  };

  return useLocalLogin() ? (
    <DevLogin />
  ) : (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container">
        <OktaSignInWidget onSuccess={() => {}} onError={() => {}} />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default Login;
