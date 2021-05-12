import React, { useEffect } from 'react';

import Header from 'components/Header';

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);
  return (
    <div>
      <Header />
      <div className="grid-container">
        <h1>Sandbox</h1>
      </div>
    </div>
  );
};

export default Sandbox;
