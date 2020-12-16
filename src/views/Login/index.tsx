import React from 'react';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';
import { isDevEnvironment } from 'utils/local';
import DevLogin from 'views/AuthenticationWrapper/DevLogin';

const Login = () => {
  return isDevEnvironment() ? (
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
