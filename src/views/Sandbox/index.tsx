import React, { useEffect } from 'react';

import SystemRepositoryTable from 'views/SystemRepositoryTable';

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return <SystemRepositoryTable />;
};

export default Sandbox;
