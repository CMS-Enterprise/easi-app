import React, { useEffect } from 'react';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <></>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default Sandbox;
