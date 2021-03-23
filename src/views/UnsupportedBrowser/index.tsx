import React from 'react';

import PageHeading from 'components/PageHeading';

const UnsupportedBrowser = () => (
  <div>
    <PageHeading>This browser is not supported</PageHeading>
    <h2>Please use a supported modern browser.</h2>
    <h2>Google Chrome, Mozilla Firefox, Microsoft Edge</h2>
  </div>
);

export default UnsupportedBrowser;
