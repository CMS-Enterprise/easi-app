import React, { useEffect } from 'react';
import { IconCheckCircle, Tag } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';

import '../SystemProfile/components/SystemDetails/index.scss';

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return (
    <MainContent>
      <div id="system-detail">
        <Tag className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter">
          <IconCheckCircle className="system-profile__icon text-primary-dark margin-right-1" />
          E-CAP Initiative
        </Tag>
      </div>
    </MainContent>
  );
};

export default Sandbox;
