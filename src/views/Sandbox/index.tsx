import React, { useEffect } from 'react';

import MainContent from 'components/MainContent';

import '../SystemProfile/components/SystemDetails/index.scss';

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
