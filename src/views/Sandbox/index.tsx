import React from 'react';
import Header from 'components/Header';
import ActionBanner from 'components/shared/ActionBanner';

// This view can be deleted whenever we're ready
// This is just a sandbox page for us to test things out

const Sandbox = () => {
  return (
    <div>
      <Header />
      <div className="grid-container">
        <h1>Sandbox</h1>
        <ActionBanner />
      </div>
    </div>
  );
};

export default Sandbox;
