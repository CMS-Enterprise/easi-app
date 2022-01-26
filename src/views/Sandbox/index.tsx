import React, { useEffect } from 'react';

import MainContent from 'components/MainContent';

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return (
    <MainContent>
      <></>
    </MainContent>
  );
};

export default Sandbox;
