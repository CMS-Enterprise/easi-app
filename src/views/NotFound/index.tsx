import React from 'react';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';

import NotFoundPartial from './NotFoundPartial';

import './index.scss';

const NotFound = () => {
  return (
    <PageWrapper className="easi-not-found">
      <Header />
      <MainContent className="grid-container">
        <NotFoundPartial />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export { NotFoundPartial };
export default NotFound;
