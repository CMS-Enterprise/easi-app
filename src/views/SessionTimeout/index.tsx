import React from 'react';

import Header from 'components/Header';
import MainContent from 'components/MainContent';

const SessionTimeout = () => {
  return (
    <div>
      <Header />
      <MainContent className="grid-container">
        <h1>Your access to EASi has expired.</h1>
        <p>
          We signed you out of EASi because you did not do anything on the page
          for 5 minutes. We did this to keep your information secure.
        </p>
        <p>Your data has been saved to pick up from where you left off.</p>
      </MainContent>
    </div>
  );
};

export default SessionTimeout;
