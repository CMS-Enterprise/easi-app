import React from 'react';
import Header from 'components/Header';
import UpcomingActions from 'components/shared/UpcomingActions';
import ActionBanner from '../../components/shared/ActionBanner/index.tsx';

// This view can be deleted whenever we're ready
// This is just a sandbox page for us to test things out

const Sandbox = () => {
  return (
    <div>
      <Header />
      <div className="grid-container">
        <h1>Sandbox</h1>
        <UpcomingActions timestamp="FAKE TIME">
          <ActionBanner
            title="thing"
            helpfulText="lots of helpful text"
            label="I am a button"
            onClick={() => {}}
          />
        </UpcomingActions>
      </div>
    </div>
  );
};

export default Sandbox;
