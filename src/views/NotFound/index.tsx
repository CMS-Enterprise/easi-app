import React from 'react';

import Header from 'components/Header';
import MainContent from 'components/MainContent';

import NotFoundPartial from './NotFoundPartial';

import './index.scss';

const NotFound = () => {
  return (
    <div className="easi-not-found">
      <Header />
      <MainContent className="grid-container">
        <NotFoundPartial />
      </MainContent>
    </div>
  );
};

export { NotFoundPartial };
export default NotFound;
