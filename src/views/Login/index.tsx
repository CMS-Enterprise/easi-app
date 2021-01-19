import React from 'react';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';
import { localAuthStorageKey } from 'constants/localAuth';
import { isLocalEnvironment } from 'utils/local';
import DevLogin from 'views/AuthenticationWrapper/DevLogin';

const Login = () => {
  const useLocalLogin = () => {
    return (
      isLocalEnvironment() &&
      window.localStorage[localAuthStorageKey] &&
      JSON.parse(window.localStorage[localAuthStorageKey]).favorLocalAuth
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
