import React, { useEffect } from 'react';

import { SystemList } from 'views/SystemList';

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return <SystemList />;
};

export default Sandbox;
